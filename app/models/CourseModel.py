# src/models/CourseModel.py

from marshmallow import fields, Schema
import datetime
from .. import db
import uuid

class CourseModel(db.Model):
    """
    Course Model
    """

    # table name
    __tablename__ = 'courses'

    # columns
    id = db.Column(db.String(36), primary_key=True) # uuid
    dept = db.Column(db.String(128), nullable=True)    # TODO: remove entirely?
    coursenum = db.Column(db.Integer, nullable=True)   # TODO: same
    title = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(1024), nullable=True)
    year = db.Column(db.Integer, nullable=True)
    term = db.Column(db.String(32), nullable=True)
    creator_id = db.Column(db.String(36), db.ForeignKey('professors.id', onupdate='CASCADE', ondelete='SET NULL'))  # TODO: should delete the course when the last prof for that course is deleted
    created_at = db.Column(db.DateTime)
    modified_at = db.Column(db.DateTime)
    enroll_code = db.Column(db.String(8), nullable=True)

    # relationships
    lectures = db.relationship('LectureModel', backref='course', lazy=True, passive_deletes=True)

    # class constructor
    def __init__(self, data):
        """
        Class constructor
        """
        self.id = str(uuid.uuid4())
        self.dept = data.get('dept')
        self.coursenum = data.get('coursenum')
        self.title = data.get('title')
        self.description = data.get('description')
        self.year = data.get('year')
        self.term = data.get('term')
        self.creator_id = data.get('creator_id')
        timestamp = datetime.datetime.utcnow()
        self.created_at = timestamp
        self.modified_at = timestamp
        self.enroll_code = None

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
    def get_all_courses():
        return CourseModel.query.all()

    @staticmethod
    def get_course_by_uuid(value):
        return CourseModel.query.filter_by(id=value).first()

    @staticmethod
    def get_course_by_code(value):
        return CourseModel.query.filter_by(enroll_code=value).first()

    def __repr__(self):
        return '<Course(title {})>'.format(self.title)

class CourseSchema(Schema):
    """
    Course Schema
    """
    id = fields.Str(dump_only=True)
    dept = fields.Str()
    coursenum = fields.Str()
    title = fields.Str(required=True)
    description = fields.Str()
    year = fields.Integer()
    term = fields.Str()
    creator_id = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    modified_at = fields.DateTime(dump_only=True)
    enroll_code = fields.Str(dump_only=True)
