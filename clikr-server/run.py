 # /run.py
import os
from app import create_app, socketio

env_name = os.getenv('FLASK_ENV')
app = create_app(env_name)

if __name__ == '__main__':
    port = os.getenv('PORT')
    # run app
    socketio.run(app, host='0.0.0.0', port=port)