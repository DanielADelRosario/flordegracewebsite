# C:\Users\arla1\OneDrive\Desktop\Codes\Flask Website\app.py

from flask import Flask, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from init_db import Config                          # from init_db.py, import Config
from models import db
from flask_migrate import Migrate

from controller.configController import config_bp
from controller.imageController import resize_image


app = Flask(__name__)
# Load configuration from Config class
app.config.from_object(Config)

# Initialize the database object
db.init_app(app)

# Setup migration
migrate = Migrate(app, db)

@app.route('/')
def index():
    return render_template('homepage.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/admissions')
def admissions():
    return render_template('admissions.html')

@app.route('/requirements')
def requirements():
    return render_template('requirements.html')

@app.route('/faqs')
def faqs():
    return render_template('faqs.html')

@app.route('/resize-image/<filename>')
def resize_image_route(filename):
    return resize_image(filename)

if __name__ == '__main__':
    app.run(port=5000)
