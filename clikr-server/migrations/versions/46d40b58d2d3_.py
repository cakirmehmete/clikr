"""empty message

Revision ID: 46d40b58d2d3
Revises: 866d327eede3
Create Date: 2018-10-31 11:22:15.371658

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '46d40b58d2d3'
down_revision = '866d327eede3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('students') # manually adjusted because didn't detect every change
    op.create_table('students',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('netId', sa.String(length=128), nullable=False),
    sa.Column('firstName', sa.String(length=128), nullable=False),
    sa.Column('lastName', sa.String(length=128), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('modified_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('students')
    # ### end Alembic commands ###