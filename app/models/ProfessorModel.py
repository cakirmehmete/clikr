# src/models/ProfessorModel.py

from marshmallow import fields, Schema
import datetime
from .. import db
from ..shared.Util import CustomStringField, CustomDateTimeField, generate_salt
import uuid
import hashlib

# helper table for the many-to-many relationship courses_profs
courses_profs = db.Table('courses_profs',
    db.Column('course_id', db.String(36), db.ForeignKey('courses.id', onupdate='CASCADE', ondelete='CASCADE'), primary_key=True),
    db.Column('professor_id', db.String(36), db.ForeignKey('professors.id', onupdate='CASCADE', ondelete='CASCADE'), primary_key=True)
)

class ProfessorModel(db.Model):
    """
    Professor Model
    """

    # table name
    __tablename__ = 'professors'

    # columns
    id = db.Column(db.String(36), primary_key=True) # uuid
    netId = db.Column(db.String(128), unique=True, nullable=False)
    firstName = db.Column(db.String(128), nullable=True)
    lastName = db.Column(db.String(128), nullable=True)
    created_at = db.Column(db.DateTime)
    modified_at = db.Column(db.DateTime)

    # relationships
    created_courses = db.relationship('CourseModel', backref='creator', lazy=True, passive_deletes=True)
    courses = db.relationship('CourseModel', secondary=courses_profs, lazy=True, backref='professors', passive_deletes=True)

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
    def get_all_professors():
        return ProfessorModel.query.all()

    @staticmethod
    def get_professor_by_netId(value):
        return ProfessorModel.query.filter_by(netId=value).first()

    @staticmethod
    def get_professor_by_uuid(value):
        return ProfessorModel.query.filter_by(id=value).first()

    def __repr__(self):
        return '<Professor(netId {})>'.format(self.netId)

class ProfessorSchema(Schema):
    """
    Professor Schema
    """
    id = CustomStringField(dump_only=True)
    netId = CustomStringField(required=True)
    firstName = CustomStringField()
    lastName = CustomStringField()
    created_at = CustomDateTimeField(dump_only=True)
    modified_at = CustomDateTimeField(dump_only=True)