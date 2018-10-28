# clikr-server

```
pipenv --three
pipenv shell
``` 

# Env
export FLASK_ENV=development
export DATABASE_URL=postgres://USER:PASS@HOST:PORT/DB_NAME
export PORT=

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