#src/app.py

from flask import Flask

from .config import app_config
from .models import db

from .views.StudentView import student_api as student_blueprint
from .views.ProfessorView import professor_api as professor_blueprint
from .views.AdminView import admin_api as admin_blueprint

def create_app(env_name):
  """
  Create app
  """
  
  # app initiliazation
  app = Flask(__name__)

  app.config.from_object(app_config[env_name])
  db.init_app(app)

  app.register_blueprint(student_blueprint, url_prefix='/api/v1/students')
  app.register_blueprint(professor_blueprint, url_prefix='/api/v1/professors')
  app.register_blueprint(admin_blueprint, url_prefix='/api/v1/admins')

  @app.route('/', methods=['GET'])
  def index():
    """
    example endpoint
    """
    return 'Congratulations! Your first endpoint is working'

  return app