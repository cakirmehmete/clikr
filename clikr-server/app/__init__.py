# app/__init__.py
import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_sslify import SSLify

from .config import app_config
from .shared.CASClient import CASClient

# flask extensions
db = SQLAlchemy()
socketio = SocketIO()

# CAS authentication
cas = CASClient()   # TODO: should use env variable for CAS server

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
    app = Flask(__name__, static_folder='react_app/build')
    app.config.from_object(app_config[env_name])
    
    # initialize flask extensions
    db.init_app(app)
    socketio.init_app(app)
    sslify = SSLify(app, permanent=True)

    # register blueprints
    from .views.StudentView import student_api as student_blueprint
    app.register_blueprint(student_blueprint, url_prefix='/api/v1/student')

    from .views.ProfessorView import professor_api as professor_blueprint
    app.register_blueprint(professor_blueprint, url_prefix='/api/v1/professor')

    from .views.AdminView import admin_api as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix='/api/v1/admin')

    CORS(app, supports_credentials=True)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, "react_app/build/", path)
        print("======THE PATH IS", filename)
        if path != "" and os.path.exists(filename):
            print("GOING TO SEND A FILE!")
            return send_from_directory('react_app/build/', path)
        else:
            return send_from_directory('react_app/build', 'index.html')

    return app