#src/models/__init__.py

from flask_sqlalchemy import SQLAlchemy

# initialize our db
db = SQLAlchemy()

# schemas
from .StudentModel import StudentModel, StudentSchema