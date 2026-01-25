# Intelligent Work Schedule Generator

A full-stack web application that **automatically generates employee work schedules** for shift-based companies (e.g., gas stations, warehouses, hospitals, call centers).

This project was developed within the course **Projekt zespołowy PAI (Programowanie Aplikacji Internetowych)** as a **team project**.  

---

## What the app does

The system helps an employer create a monthly schedule by providing:
- a list of employees (with an *employment fraction*, e.g. 1.0 / 0.5),
- shift definitions (start hour, duration, required headcount),
- scheduling rules (e.g., minimum rest hours),
- calendar mode (Mon–Fri / Mon–Sat / every day),
- holiday mode (include or exclude public holidays).

The output is a complete assignment of employees to shifts for each scheduled day, plus per-employee summary statistics.

---

## Tech stack
- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL
- **Optimization:** **Google OR-Tools (CP-SAT)**
- **Frontend:** React, React Router

---

## Key features (implemented)

### ✅ Automatic schedule generation with OR-Tools (CP-SAT)
Schedule generation is built using **Google OR-Tools** and solved as a **Constraint Programming** problem (CP-SAT).

**Core model**
- **Decision variables:** `x[e, day, shift] ∈ {0,1}` (whether employee *e* works a given shift on a given day)
- **Hard constraints:**
  - **Shift coverage:** each shift/day must have exactly the required number of employees
  - **At most one shift per employee per day**
  - **Minimum rest time between consecutive working days** (based on shift start + length)
  - **Optional max consecutive working days** (sliding window constraint)
- **Objective (optimization):**
  - minimize total deviation from target monthly hours per employee  
    target hours are based on:
    - employee `employment_fraction` (e.g., 0.5 FTE)
    - calculated **standard full-time hours for the given month in Poland**
      (includes adjustments for public holidays)

The solver returns a feasible/optimal schedule; if constraints are too strict, the API reports that the schedule cannot be generated for the given parameters.

---

## Holiday mode (Poland)
The generator supports **public holidays in Poland**:
- **Work on holidays enabled:** holidays are treated as normal working days (depending on selected work mode)
- **Work on holidays disabled:** holidays are removed from the scheduling calendar  
  (applies to Mon–Fri / Mon–Sat / every day modes)

This allows running the same algorithm for companies that operate on holidays and those that don’t.

---

## Scheduling modes
The generator can build schedules for different company work patterns:
- `every_day` — schedule all calendar days (unless holidays are excluded)
- `mon_fri` — schedule Monday–Friday only (and optionally exclude holidays)
- `mon_sat` — schedule Monday–Saturday (and optionally exclude holidays)

---

## Output
The generation result includes:
- **Schedule**: day-by-day list of shifts with assigned employees
- **Summary**: per employee
  - number of assigned shifts
  - assigned hours
  - target hours (based on FTE and month full-time hours)
- **Metadata**: month info (days in month, number of scheduled days, used full-time hours)

---


