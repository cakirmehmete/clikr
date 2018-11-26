import jwt
import os
import datetime
from flask import json, jsonify, Response, request, session
from functools import wraps
from ..models.StudentModel import StudentModel, StudentSchema
from ..models.ProfessorModel import ProfessorModel, ProfessorSchema

# mostly copied from https://www.codementor.io/olawalealadeusi896/restful-api-with-python-flask-framework-and-postgres-db-part-1-kbrwbygx5
class Auth():
    """
    Does not provide authentication at the moment! Right now, its only purpose is to identify the current user.
    Export environment variable JWT_SECRET_KEY to make it work.
    """
    @staticmethod
    def generate_token(user_id, role):
        """
        Generate Token Method
        """
        try:
            payload = {
                'id': user_id,
                'role': role,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8) # arbitrarily chosen
            }
            token = jwt.encode(payload, os.getenv('JWT_SECRET_KEY'),'HS256').decode('UTF-8')
            return token

        except Exception as e:
            print(str(e))
            return None

    @staticmethod
    def student_token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None

            if 'x-access-token' in request.headers:
                token = request.headers['x-access-token']

            if not token:
                return jsonify({'message' : 'Token is missing!'}), 401

            try: 
                data = jwt.decode(token, os.getenv('JWT_SECRET_KEY'))
                if data['role'] != 'student':
                    return jsonify({'error': 'Permission denied'})

                current_user = StudentModel.get_student_by_netId(data['id'])
            except Exception as e:
                print(str(e))
                return jsonify({'message' : 'Token is invalid!'}), 401

            print('current user: ' + str(current_user))
            return f(current_user, *args, **kwargs)

        return decorated

    @staticmethod
    def professor_token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None

            if 'x-access-token' in request.headers:
                token = request.headers['x-access-token']

            if not token:
                return jsonify({'message' : 'Token is missing!'}), 401

            try: 
                data = jwt.decode(token, os.getenv('JWT_SECRET_KEY'))
                if data['role'] != 'professor':
                    return jsonify({'error': 'Permission denied'})

                current_user = ProfessorModel.get_professor_by_netId(data['id'])
            except Exception as e:
                print(str(e))
                return jsonify({'message' : 'Token is invalid!'}), 401

            print('current user: ' + str(current_user))
            return f(current_user, *args, **kwargs)

        return decorated

    @staticmethod
    def professor_auth_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):

            if (not 'username' in session) or (not 'role' in session):
                return jsonify({'error': 'not logged in'}), 401
            
            username = session['username']
            role = session['role']

            if role != 'professor':
                return jsonify({'error': 'permission denied'}), 401
            
            current_user = ProfessorModel.get_professor_by_netId(username)
            
            print('current user: ' + str(current_user))
            return f(current_user, *args, **kwargs)

        return decorated

    @staticmethod
    def student_auth_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):

            if (not 'username' in session) or (not 'role' in session):
                return jsonify({'error': 'not logged in'}), 401
            
            username = session['username']
            role = session['role']

            if role != 'student':
                return jsonify({'error': 'permission denied'}), 401
            
            current_user = StudentModel.get_student_by_netId(username)
            
            print('current user: ' + str(current_user))
            return f(current_user, *args, **kwargs)

        return decorated