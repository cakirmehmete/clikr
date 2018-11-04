"""empty message

Revision ID: 866d327eede3
Revises: 0ee17a6f52cf
Create Date: 2018-10-31 11:06:28.707892

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '866d327eede3'
down_revision = '0ee17a6f52cf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('students_firstName_key', 'students', type_='unique')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('students_firstName_key', 'students', ['firstName'])
    # ### end Alembic commands ###
