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
    Export environment variable SECRET_KEY to make it work.
    """

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
            print(current_user)
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
            
            return f(current_user, *args, **kwargs)

        return decorated

    @staticmethod
    def authenticate_professor():
        """
        this method can be used in socketIO event handlers to authenticate a professor
        (the professor_auth_required decorator is not applicable to socketIO event handlers)
        """
        if (not 'username' in session) or (not 'role' in session):
            return None
        
        username = session['username']
        role = session['role']

        if role != 'professor':
            return None

        current_user = ProfessorModel.get_professor_by_netId(username)  # note that this could be None
        return current_user

    @staticmethod
    def authenticate_student():
        """
        this method can be used in socketIO event handlers to authenticate a student
        (the student_auth_required decorator is not applicable to socketIO event handlers)
        """
        if (not 'username' in session) or (not 'role' in session):
            return None
        
        username = session['username']
        role = session['role']

        if role != 'student':
            return None

        current_user = StudentModel.get_student_by_netId(username) # note that this could be none
        return current_user
