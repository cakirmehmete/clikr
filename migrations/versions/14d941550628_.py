"""empty message

Revision ID: 14d941550628
Revises: f8456fe85d3f
Create Date: 2018-11-01 14:43:27.791952

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '14d941550628'
down_revision = 'f8456fe85d3f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('professors',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('netId', sa.String(length=128), nullable=False),
    sa.Column('firstName', sa.String(length=128), nullable=True),
    sa.Column('lastName', sa.String(length=128), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('modified_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('netId')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('professors')
    # ### end Alembic commands ###