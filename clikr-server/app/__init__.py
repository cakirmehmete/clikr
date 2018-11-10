# app/__init__.py

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

from .config import app_config

# flask extensions
db = SQLAlchemy()
socketio = SocketIO()

# import models such that they are registered with sqlalchemy
from .models.StudentModel import StudentModel, StudentSchema
from .models.ProfessorModel import ProfessorModel, ProfessorSchema
from .models.CourseModel import CourseModel, CourseSchema
from .models.LectureModel import LectureModel, LectureSchema
from .models.QuestionModel import QuestionModel, QuestionSchema

def create_app(env_name):
    """
    Create app
    """
    
    # initialize flask app
    app = Flask(__name__)
    app.config.from_object(app_config[env_name])
    
    # initialize flask extensions
    db.init_app(app)
    socketio.init_app(app)

    # register blueprints
    from .views.StudentView import student_api as student_blueprint
    app.register_blueprint(student_blueprint, url_prefix='/api/v1/student')

    from .views.ProfessorView import professor_api as professor_blueprint
    app.register_blueprint(professor_blueprint, url_prefix='/api/v1/professor')

    from .views.AdminView import admin_api as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix='/api/v1/admin')

    CORS(app)

    @app.route('/', methods=['GET'])
    def index():
        """
        example endpoint
        """
        return 'Congratulations! Your first endpoint is working'

    return app