import calendar
import holidays
from datetime import date
from typing import List
from ortools.sat.python import cp_model
from schemas.schedule import OneShift
import models
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

class ScheduleService:
    def __init__(self, db: Session):
        self.db = db

    def compute_rest_hours(self, start1: int, length1: int, start2: int) -> int:
        """
        Calculates hours from the end of a shift (day d) to the start of a shift (day d+1).
        
        Args:
            start1: Start hour of the first shift (0..23).
            length1: Length of the first shift in hours.
            start2: Start hour of the next day's shift (0..23).
            
        Returns:
            Rest duration in hours.
        """
        end1 = (start1 + length1) % 24
        # If the shift ends after midnight (end1 < start1), it ends on day d+1? 
        # Note: The logic below assumes shifts typically wrap within 24h cycle logic.
        end1_abs = end1 if end1 > start1 else end1 + 24
        start2_abs = start2 + 24
        return start2_abs - end1_abs

    def get_days_list(self, year: int, month: int, company_work_mode: str, work_holidays: bool) -> List[int]:
        """
        Returns a list of day indexes (0-based) for which the schedule should be generated.
        
        Modes:
        - "every_day": Returns all days in the month.
        - "mon_fri": Returns only weekdays (Monday-Friday).
        - "mon_sat"(Fallback): Returns weekdays + saturday (Monday-Saturday).
        
        Handles holiday logic based on the `work_holidays` flag.
        """
        days_in_month = calendar.monthrange(year, month)[1]
        
        # Case 1: Working on holidays is allowed
        if work_holidays:
            if company_work_mode == "every_day":
                return list(range(days_in_month))
            
            if company_work_mode == "mon_fri":
                days = []
                for d in range(1, days_in_month + 1):
                    weekday = date(year, month, d).weekday()  # 0=Mon ... 6=Sun
                    if weekday < 5:
                        days.append(d - 1)
                return days
            
            # Fallback (assumes specific custom mode or similar to everyday but excluding Sundays)
            days = []
            for d in range(1, days_in_month + 1):
                weekday = date(year, month, d).weekday()
                if weekday < 6:
                    days.append(d - 1)
            return days

        # Case 2: Holidays are non-working days
        else:
            pl_holidays = holidays.Poland(years=year)
            
            if company_work_mode == "every_day":
                days = []
                for d in range(1, days_in_month + 1):
                    dt = date(year, month, d)
                    weekday = dt.weekday()
                    # Skip if it is a holiday, but ensure Sundays are handled if needed
                    if dt in pl_holidays and weekday < 6:
                        continue
                    days.append(d - 1) 
                return days
            
            if company_work_mode == "mon_fri":
                days = []
                for d in range(1, days_in_month + 1):
                    dt = date(year, month, d)
                    weekday = dt.weekday()
                    if weekday < 5:
                        if dt in pl_holidays:
                            continue
                        days.append(d - 1)
                return days
            
            # mon_sat
            days = []
            for d in range(1, days_in_month + 1):
                dt = date(year, month, d)
                weekday = dt.weekday()
                if weekday < 6:
                    if dt in pl_holidays:
                        continue
                    days.append(d - 1)
            return days

    def calculate_poland_full_time_hours(self, year: int, month: int) -> int:
        """
        Calculates standard full-time working hours for a given month in Poland.
        Formula: (Working Days * 8) - (Holidays falling on Mon-Sat * 8) +/ corrections.
        """
        days_in_month = calendar.monthrange(year, month)[1]
        pl_holidays = holidays.Poland(years=year)
        full_time_hours = 0
        
        for day in range(1, days_in_month + 1):
            dt = date(year, month, day)
            weekday = dt.weekday()
            
            # Add 8 hours for Mon-Fri
            if weekday < 5:
                full_time_hours += 8
            
            # Subtract 8 hours if a holiday falls on a workday (Mon-Sat logic adjustment)
            if dt in pl_holidays and weekday < 6:
                full_time_hours -= 8
                
        return full_time_hours

    def generate_schedule(self, request, user: models.User):
        """
        Generates a work schedule using Constraint Programming (OR-Tools).

        Args:
            request: ScheduleRequest object containing:
                     - employees, year, month
                     - shifts (name, start_hour, length, required)
                     - rules (min_rest_hours, max_consecutive_days, etc.)
            user: Current user (Employer).

        Returns:
            Dictionary containing:
            - schedule: List of days with assigned shifts.
            - summary: Statistics per employee.
            - meta: Metadata about calculation.
        """
        employees = self.db.query(models.Employee).filter(models.Employee.employer_id == user.employer_id).all()
        shifts = request.shifts
        year = request.year
        month = request.month
        rules = request.rules
        preferences = request.preferences
        # preferences = getattr(request, "preferences", None) or []

        # 1. Determine calendar days
        days_in_month = calendar.monthrange(year, month)[1]
        
        # Get list of actual working days (e.g., removing weekends/holidays if applicable)
        days_list = self.get_days_list(year, month, request.company_work_mode, request.holidays_mode)
        scheduled_days_count = len(days_list)

        # 2. Calculate standard full-time hours for the month
        full_time_hours = self.calculate_poland_full_time_hours(request.year, request.month)

        # 3. Initialize CP Model
        model = cp_model.CpModel()
        E = len(employees)
        S = len(shifts)
        D = scheduled_days_count  # Number of days actually being scheduled

        # Map internal day index (0..D-1) to actual day of the month
        day_idx_to_actual = {idx: days_list[idx] for idx in range(D)}

        # Нужно для преобразования (employee_id, day) -> (e_idx, di)
        actual_to_di = {actual_day: di for di, actual_day in day_idx_to_actual.items()}
        emp_id_to_idx = {emp.id: idx for idx, emp in enumerate(employees)}
        
        # --- Variables ---
        # x[employee, day_index, shift] -> boolean decision variable
        x = {}
        for e in range(E):
            for di in range(D):
                for s in range(S):
                    x[(e, di, s)] = model.NewBoolVar(f"x_e{e}_d{di}_s{s}")

        # --- Constraints ---

        # 1. Coverage: Ensure required number of employees per shift per day
        for di in range(D):
            for s_idx, shift in enumerate(shifts):
                model.Add(sum(x[(e, di, s_idx)] for e in range(E)) == shift.required)

        # 2. Max one shift per day per employee
        for e in range(E):
            for di in range(D):
                model.Add(sum(x[(e, di, s)] for s in range(S)) <= 1)

        # 3. Minimum rest time between shifts (checking consecutive days in days_list)
        for e in range(E):
            for di in range(D - 1):
                for s1_idx, sh1 in enumerate(shifts):
                    for s2_idx, sh2 in enumerate(shifts):
                        rest = self.compute_rest_hours(sh1.start_hour, sh1.length, sh2.start_hour)
                        # If rest time is insufficient, forbid this sequence
                        if rest < rules.min_rest_hours:
                            model.Add(x[(e, di, s1_idx)] + x[(e, di + 1, s2_idx)] <= 1)

        # 4. Maximum consecutive working days (Optional)
        if rules.max_consecutive_days:
            M = rules.max_consecutive_days
            if M < D:
                for e in range(E):
                    # Sliding window constraint
                    for start in range(0, D - (M + 1) + 1):
                        window_terms = []
                        for dd in range(start, start + M + 1):
                            window_terms.append(sum(x[(e, dd, s)] for s in range(S)))
                        # Sum of worked days in window of size M+1 must be <= M
                        model.Add(sum(window_terms) <= M)

        # --- Objective Function ---

        # Determine theoretical upper bound for total hours to define variable domains
        max_shift_len = max((int(sh.length) for sh in shifts), default=0)
        max_hours_per_employee = D * max_shift_len

        # Objective: Minimize deviation between actual hours and target hours 
        deviations_hours = [] 

        for e_idx, emp in enumerate(employees):
            # Calculate total assigned hours for this employee
            # Expression: sum(shift_length * is_assigned)
            total_hours_expr = sum(int(sh.length) * x[(e_idx, di, s_idx)]
                                for di in range(D)
                                for s_idx, sh in enumerate(shifts))

            # Calculate target hours: employment_fraction * full_time_hours
            target_hours = int(round(emp.employment_fraction * full_time_hours))

            # Create an auxiliary variable for absolute deviation:
            # dev_h >= | total_hours - target_hours |
            dev_h = model.NewIntVar(0, max_hours_per_employee, f"dev_hours_e{e_idx}")
            
            # Linearize absolute value constraint
            model.Add(total_hours_expr - target_hours <= dev_h)
            model.Add(target_hours - total_hours_expr <= dev_h)

            deviations_hours.append(dev_h)

        # --- Soft penalties: day off requests (additional option) ---
        penalties = []
        day_off_meta = []

        print("DEBUG request:", request)


        DEFAULT_DAY_OFF_PENALTY = 50

        for req in preferences:
            # поддержка pydantic или dict
            employee_id = getattr(req, "employee_id", None)
            day_1based = getattr(req, "day", None)

            if isinstance(req, dict):
                employee_id = employee_id or req.get("employee_id")
                day_1based = day_1based or req.get("day")

            info = {
                "employee_id": employee_id,
                "day": day_1based,
                "applied": False,
                "reason": None
            }

            # валидация
            if not employee_id or not day_1based:
                info["reason"] = "invalid_payload"
                day_off_meta.append(info)
                continue

            e_idx = emp_id_to_idx.get(int(employee_id))
            actual_day_0based = int(day_1based) - 1
            di = actual_to_di.get(actual_day_0based)

            if e_idx is None:
                info["reason"] = "employee_not_found"
                day_off_meta.append(info)
                continue

            if di is None:
                # день не планируется (например, выходной по режиму)
                info["reason"] = "day_not_scheduled_by_mode"
                day_off_meta.append(info)
                continue

            # 0/1: работает ли сотрудник в этот день
            worked_that_day = sum(x[(e_idx, di, s)] for s in range(S))
            req_penalty = getattr(req, "penalty", None)
            if isinstance(req, dict):
                req_penalty = req_penalty if req_penalty is not None else req.get("penalty")

            # дефолт 50 если не передали
            try:
                req_penalty = int(req_penalty) if req_penalty is not None else 50
            except Exception:
                req_penalty = 50

            penalties.append(req_penalty * worked_that_day)
            # фиксированный штраф
            # penalties.append(DEFAULT_DAY_OFF_PENALTY * worked_that_day)

            info["applied"] = True
            info["reason"] = "soft_penalty_added"
            day_off_meta.append(info)

            
        # Minimize the sum of hourly deviations across all employees
        W_HOURS = 2
        model.Minimize(W_HOURS * sum(deviations_hours) + sum(penalties))
        # sum_deviations_hours = int(sum(deviations_hours))
        print(deviations_hours)
        # --- Solve ---
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = 300
        solver.parameters.num_search_workers = 8

        result = solver.Solve(model)
        
        if result not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Can't generate schedule using these parameters"
            )

        # --- Format Output ---
        
        # Construct the schedule list (mapping back to real calendar days)
        schedule = []
        for di in range(D):
            actual_day = day_idx_to_actual[di]
            day_shifts_with_employees: List[OneShift] = []
            
            for s_idx, shift in enumerate(shifts):
                emps = [
                    f"{employees[e].first_name} {employees[e].last_name}"
                    for e in range(E)
                    if solver.Value(x[(e, di, s_idx)]) == 1
                ]
                day_shifts_with_employees.append({
                    "shift": shift.name,
                    "employees": emps
                })
                
            schedule.append({
                "day": actual_day + 1, # Return as 1-based day number
                "shifts": day_shifts_with_employees
            })

        # Generate summary stats
        summary = {}
        for i in range(E):
            worked_shifts = int(sum(solver.Value(x[(i, di, s)]) for di in range(D) for s in range(S)))
            worked_hours = int(sum(int(sh.length) * solver.Value(x[(i, di, s)])
                                for di in range(D)
                                for s, sh in enumerate(shifts)))
            
            summary[f"{employees[i].first_name} {employees[i].last_name}"] = {
                "shifts": worked_shifts,
                "hours": worked_hours,
                "target": int(round(employees[i].employment_fraction * full_time_hours))
            }

        meta = {
            "days_in_month": days_in_month,
            "scheduled_days_count": scheduled_days_count,
            "full_time_hours_used": full_time_hours,
            "max_hours_per_employee": max_hours_per_employee,
            "preferences": day_off_meta,
        }

        return {"schedule": schedule, "summary": summary, "meta": meta}