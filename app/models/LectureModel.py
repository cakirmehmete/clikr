# src/models/LectureModel.py

from marshmallow import fields, Schema
import datetime
from .. import db
from ..shared.Util import CustomStringField, CustomIntegerField, CustomDateTimeField, CustomDateField
import uuid

class LectureModel(db.Model):
    """
    Lecture Model
    """

    # table name
    __tablename__ = 'lectures'

    # columns
    id = db.Column(db.String(36), primary_key=True) # uuid
    course_id = db.Column(db.String(36), db.ForeignKey('courses.id', onupdate='CASCADE', ondelete='CASCADE'))
    date = db.Column(db.Date, nullable=True)
    title = db.Column(db.String(256), nullable=True)
    description = db.Column(db.String(1024), nullable=True)
    creator_id = db.Column(db.String(36), db.ForeignKey('professors.id', onupdate='CASCADE', ondelete='SET NULL'))
    created_at = db.Column(db.DateTime)
    modified_at = db.Column(db.DateTime)

    # relationships
    questions = db.relationship('QuestionModel', backref='lecture', lazy=True, passive_deletes=True)

    # class constructor
    def __init__(self, data):
        """
        Class constructor
        """
        self.id = str(uuid.uuid4())
        self.course_id = data.get('course_id')
        self.date = data.get('date')
        self.title = data.get('title')
        self.description = data.get('description')
        self.creator_id = data.get('creator_id')
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
    def get_all_lectures():
        return LectureModel.query.all()

    @staticmethod
    def get_lecture_by_uuid(value):
        return LectureModel.query.filter_by(id=value).first()

    def __repr__(self):
        return '<Lecture(id {})>'.format(self.id)

class LectureSchema(Schema):
    """
    Lecture Schema
    """
    id = CustomStringField(dump_only=True)
    course_id = CustomStringField(required=True)
    date = CustomDateField()
    title = CustomStringField()
    description = CustomStringField()
    creator_id = CustomStringField()
    created_at = CustomDateTimeField(dump_only=True)
    modified_at = CustomDateTimeField(dump_only=True)
