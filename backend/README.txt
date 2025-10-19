How to get started?

# 1. Create a virtual environment

Go to the ./user-service folder in the terminal:

python -m venv env

# 2. Activate it
# On Windows:
env\Scripts\activate
# On macOS / Linux:
source env/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the server

Go to the ./user-service/app folder:

uvicorn main:app --reload

To make it work properly, you need to add your PostgreSQL database URL in db.py

---

### ℹ️ Note
This instruction is for the **first start**.  
For all subsequent runs, you only need to follow **steps 2 and 4** to start the server.

-------------------------||----------------------------

The purpose of folders

api/ - Controllers (endpoints FastAPI)
core/ - Configurations (JWT, logs..)
models/ - SQLAlchemy models
schemas/ - validation schemas
services/ - business logic
