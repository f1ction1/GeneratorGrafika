from pydantic import BaseModel
from typing import List, Optional, Literal


class Employee(BaseModel):
    id: int
    first_name: str
    last_name: str
    employment_fraction: float  # 1.0, 0.5, 0.25, ...


class ShiftDefinition(BaseModel):
    name: str
    start_hour: int   # 0..23
    length: int       # hours (usually 8 hours)
    required: int     # employees per shift

class PreferenceDefinition(BaseModel):
    employee_id: int
    day: int
    priority: int


class Rules(BaseModel):
    min_rest_hours: int = 11
    max_consecutive_days: Optional[int] = None


class ScheduleRequest(BaseModel):
    year: int
    month: int
    shifts: List[ShiftDefinition]
    rules: Rules
    holidays_mode: bool
    company_work_mode: Literal["every_day", "mon_fri", "mon_sat"] 
    preferences: Optional[List[PreferenceDefinition]] = None

class OneShift(BaseModel):
    shift: str
    employees: List[str]

class AssignedShift(BaseModel):
    day: int            # 1..days_in_month
    shifts: List[OneShift]

class ScheduleMeta(BaseModel):
    days_in_month: int
    scheduled_days_count: int
    full_time_hours_used: int


class ScheduleResponse(BaseModel):
    schedule: List[AssignedShift]
    summary: dict
    meta: ScheduleMeta
