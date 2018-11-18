# src/models/StudentModel.py
from marshmallow import fields, Schema
import datetime
from .. import db
import uuid

# helper table for the many-to-many relationship courses-students
courses_students = db.Table('courses_students',
    db.Column('course_id', db.String(36), db.ForeignKey('courses.id', onupdate='CASCADE', ondelete='CASCADE'), primary_key=True),
    db.Column('student_id', db.String(36), db.ForeignKey('students.id', onupdate='CASCADE', ondelete='CASCADE'), primary_key=True)
)

class StudentModel(db.Model):
    """
    Student Model
    """

    # table name
    __tablename__ = 'students'

    # columns
    id = db.Column(db.String(36), primary_key=True) # uuid
    netId = db.Column(db.String(128), unique=True, nullable=False)
    firstName = db.Column(db.String(128), nullable=True)
    lastName = db.Column(db.String(128), nullable=True)
    created_at = db.Column(db.DateTime)
    modified_at = db.Column(db.DateTime)

    # relationships
    courses = db.relationship('CourseModel', secondary=courses_students, lazy=True, backref='students', passive_deletes=True)
    answers = db.relationship('AnswerModel', backref='answers', lazy=True, passive_deletes=True)

    # class constructor
    def __init__(self, data):
        """
        Class constructor
        """
        self.id = str(uuid.uuid4())
        self.netId = data.get('netId')
        self.firstName = data.get('firstName')
        self.lastName = data.get('lastName')
        timestamp = datetime.datetime.utcnow()
        self.created_at = timestamp
        self.modified_at = timestamp

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data):
        for key, item in data.items():
            setattr(self, key, item)
            self.modified_at = datetime.datetime.utcnow()
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all_students():
        return StudentModel.query.all()

    @staticmethod
    def get_student_by_netId(value):
        return StudentModel.query.filter_by(netId=value).first()

    @staticmethod
    def get_student_by_uuid(value):
        return StudentModel.query.filter_by(id=value).first()

    def __repr__(self):
        return '<Student(netId {})>'.format(self.netId)

class StudentSchema(Schema):
    """
    Student Schema
    """
    id = fields.Str(dump_only=True)
    netId = fields.Str(required=True)
    firstName = fields.Str()
    lastName = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    modified_at = fields.DateTime(dump_only=True)