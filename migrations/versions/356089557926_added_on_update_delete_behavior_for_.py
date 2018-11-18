"""added on update/delete behavior for foreign key constraints

Revision ID: 356089557926
Revises: 9afe0ca4a624
Create Date: 2018-11-14 09:42:44.269520

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '356089557926'
down_revision = '9afe0ca4a624'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('answers_student_id_fkey', 'answers', type_='foreignkey')
    op.drop_constraint('answers_question_id_fkey', 'answers', type_='foreignkey')
    op.create_foreign_key(None, 'answers', 'questions', ['question_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')
    op.create_foreign_key(None, 'answers', 'students', ['student_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')
    op.drop_constraint('courses_creator_id_fkey', 'courses', type_='foreignkey')
    op.create_foreign_key(None, 'courses', 'professors', ['creator_id'], ['id'], onupdate='CASCADE', ondelete='SET NULL')
    op.drop_constraint('courses_profs_professor_id_fkey', 'courses_profs', type_='foreignkey')
    op.drop_constraint('courses_profs_course_id_fkey', 'courses_profs', type_='foreignkey')
    op.create_foreign_key(None, 'courses_profs', 'courses', ['course_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')
    op.create_foreign_key(None, 'courses_profs', 'professors', ['professor_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')
    op.drop_constraint('courses_students_course_id_fkey', 'courses_students', type_='foreignkey')
    op.drop_constraint('courses_students_student_id_fkey', 'courses_students', type_='foreignkey')
    op.create_foreign_key(None, 'courses_students', 'courses', ['course_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')
    op.create_foreign_key(None, 'courses_students', 'students', ['student_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')
    op.drop_constraint('lectures_creator_id_fkey', 'lectures', type_='foreignkey')
    op.drop_constraint('lectures_course_id_fkey', 'lectures', type_='foreignkey')
    op.create_foreign_key(None, 'lectures', 'courses', ['course_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')
    op.create_foreign_key(None, 'lectures', 'professors', ['creator_id'], ['id'], onupdate='CASCADE', ondelete='SET NULL')
    op.drop_constraint('questions_lecture_id_fkey', 'questions', type_='foreignkey')
    op.drop_constraint('questions_creator_id_fkey', 'questions', type_='foreignkey')
    op.create_foreign_key(None, 'questions', 'professors', ['creator_id'], ['id'], onupdate='CASCADE', ondelete='SET NULL')
    op.create_foreign_key(None, 'questions', 'lectures', ['lecture_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'questions', type_='foreignkey')
    op.drop_constraint(None, 'questions', type_='foreignkey')
    op.create_foreign_key('questions_creator_id_fkey', 'questions', 'professors', ['creator_id'], ['id'])
    op.create_foreign_key('questions_lecture_id_fkey', 'questions', 'lectures', ['lecture_id'], ['id'])
    op.drop_constraint(None, 'lectures', type_='foreignkey')
    op.drop_constraint(None, 'lectures', type_='foreignkey')
    op.create_foreign_key('lectures_course_id_fkey', 'lectures', 'courses', ['course_id'], ['id'])
    op.create_foreign_key('lectures_creator_id_fkey', 'lectures', 'professors', ['creator_id'], ['id'])
    op.drop_constraint(None, 'courses_students', type_='foreignkey')
    op.drop_constraint(None, 'courses_students', type_='foreignkey')
    op.create_foreign_key('courses_students_student_id_fkey', 'courses_students', 'students', ['student_id'], ['id'])
    op.create_foreign_key('courses_students_course_id_fkey', 'courses_students', 'courses', ['course_id'], ['id'])
    op.drop_constraint(None, 'courses_profs', type_='foreignkey')
    op.drop_constraint(None, 'courses_profs', type_='foreignkey')
    op.create_foreign_key('courses_profs_course_id_fkey', 'courses_profs', 'courses', ['course_id'], ['id'])
    op.create_foreign_key('courses_profs_professor_id_fkey', 'courses_profs', 'professors', ['professor_id'], ['id'])
    op.drop_constraint(None, 'courses', type_='foreignkey')
    op.create_foreign_key('courses_creator_id_fkey', 'courses', 'professors', ['creator_id'], ['id'])
    op.drop_constraint(None, 'answers', type_='foreignkey')
    op.drop_constraint(None, 'answers', type_='foreignkey')
    op.create_foreign_key('answers_question_id_fkey', 'answers', 'questions', ['question_id'], ['id'])
    op.create_foreign_key('answers_student_id_fkey', 'answers', 'students', ['student_id'], ['id'])
    # ### end Alembic commands ###
