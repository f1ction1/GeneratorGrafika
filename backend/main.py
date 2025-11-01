from fastapi import FastAPI
from user_service.api.routers import employer
# import more routers later, e.g.
# from schedule_service.app import router as schedule_router

app = FastAPI(title="Monolith Backend")

# include routers
app.include_router(employer.router, prefix="/employer", tags=["employer"])
# app.include_router(schedule_router, prefix="/schedule", tags=["schedule"])

@app.get("/")
def root():
    return {"status": "ok"}
