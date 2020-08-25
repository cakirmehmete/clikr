"""empty message

Revision ID: 6b0861b8ff49
Revises: 39b79b8eee47
Create Date: 2019-08-24 15:09:43.206295

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b0861b8ff49'
down_revision = '39b79b8eee47'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('lectures', sa.Column('enroll_code', sa.String(length=8), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('lectures', 'enroll_code')
    # ### end Alembic commands ###