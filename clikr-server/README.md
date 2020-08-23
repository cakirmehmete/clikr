# clikr-server
Getting started. Let's first get into a pipenv shell so we use the same python env.
```
pipenv --three
pipenv shell
``` 

# Env
export FLASK_ENV=development 
export DATABASE_URL=postgres://USER:PASS@HOST:PORT/DB_NAME 
export PORT= 
export JWT_SECRET_KEY= 
export SECRET_KEY=

# Database
1. Install Docker
2. Install Kitematic
3. Setup Postgres image
4. Make sure to set POSTGRES_PASSWORD and POSTGRES_USER
5. Copy down the 'Access URL' port
6. Create a database: ```createdb -h localhost -p PORT -U USER DB_NAME```

# Setup Database
1. python manage.py db init
2. python manage.py db migrate
3. python manage.py db upgrade

# Deployment
```
git subtree split --branch heroku --prefix clikr-server/
```

# How to test the API
1. make sure docker and the postgres image are running
2. ```cd``` to ```clikr-server``` and make sure you're in the virtual environment: ```pipenv shell```
3. export all the required environment variables (see above)
4. make sure your DB is up to date: ```python manage.py db upgrade```
5. run the server: ```python run.py```
6. start Postman
7. create students/profs using the /admin prefix
8. log in as a prof/student using professors/login or students/login
9. add the returned token to the header ```x-access-token``` in every subsequent request

# Python style guide
* function names: ```get_all_students()```
* variable names: ```first_name```
* constants: ```MAX_ANSWER_OPTIONS```
* class names: ```StudentModel```
* indent using 4 spaces
