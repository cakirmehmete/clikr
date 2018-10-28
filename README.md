# clikr-server

```
pipenv --three
pipenv shell
```

# Env
export FLASK_ENV=development
export DATABASE_URL=postgres://name:password@localhost:32769/clikr_api_db

# Database
1. Install Docker
2. Install Kitematic
3. Setup Postgres image
4. Make sure to set POSTGRES_PASSWORD and POSTGRES_USER
5. Copy down the 'Access URL' port
6. Create a database: ```createdb -h localhost -p PORT -U USER DB_NAME```