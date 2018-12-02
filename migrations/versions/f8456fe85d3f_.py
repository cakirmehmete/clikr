"""empty message

Revision ID: f8456fe85d3f
Revises: 46d40b58d2d3
Create Date: 2018-10-31 11:41:46.379021

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f8456fe85d3f'
down_revision = '46d40b58d2d3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('students', 'firstName',
               existing_type=sa.VARCHAR(length=128),
               nullable=True)
    op.alter_column('students', 'lastName',
               existing_type=sa.VARCHAR(length=128),
               nullable=True)
    op.create_unique_constraint(None, 'students', ['netId'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'students', type_='unique')
    op.alter_column('students', 'lastName',
               existing_type=sa.VARCHAR(length=128),
               nullable=False)
    op.alter_column('students', 'firstName',
               existing_type=sa.VARCHAR(length=128),
               nullable=False)
    # ### end Alembic commands ###