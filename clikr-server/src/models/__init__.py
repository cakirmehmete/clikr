#src/models/__init__.py

from flask_sqlalchemy import SQLAlchemy

# initialize our db
db = SQLAlchemy()

# schemas
from .StudentModel import StudentModel, StudentSchema
from .ProfessorModel import ProfessorModel, ProfessorSchema
from .CourseModel import CourseModel, CourseSchema
from .LectureModel import LectureModel, LectureSchema
from .QuestionModel import QuestionModel, QuestionSchema