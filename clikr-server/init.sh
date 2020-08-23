pipenv shell

export FLASK_ENV=development 
export DATABASE_URL=postgres://christopherye:12345@localhost:5432/clikr_api_db 
export PORT=5000
export JWT_SECRET_KEY=aaa
export SECRET_KEY=aaa

python manage.py db init
python manage.py db migrate
python manage.py db upgrade

python run.py
