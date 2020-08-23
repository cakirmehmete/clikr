"""empty message

Revision ID: 611a81566c57
Revises: 6b0861b8ff49
Create Date: 2019-09-20 17:29:07.981337

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '611a81566c57'
down_revision = '6b0861b8ff49'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('students', sa.Column('lecture_attending', sa.String(length=128), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('students', 'lecture_attending')
    # ### end Alembic commands ###
