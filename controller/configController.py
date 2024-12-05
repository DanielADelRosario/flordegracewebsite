from flask import Blueprint, render_template
from models import db, Website

# Create a Blueprint for the website routes

config_bp = Blueprint('website', __name__)

@config_bp.route('/')
def index():
    return 'Sample Website'

@config_bp.route('/create-table')
def create_table():
    try:
        db.create_all()
        return 'Table created successfully!'
    except Exception as e:
        return f'Error creating table: {e}'

@config_bp.route('/add-website')
def add_website():
    try:
        new_website = Website(
            website_name="My Website",
            color_scheme="Dark Mode",
            logo_picture="path_to_logo.png"
        )
        db.session.add(new_website)
        db.session.commit()
        return 'Website added successfully!'
    except Exception as e:
        return f'Error adding website: {e}'

@config_bp.route('/view-websites')
def view_websites():
    websites = Website.query.all()
    website_list = [f"Name: {website.website_name}, Color Scheme: {website.color_scheme}, Logo: {website.logo_picture}" for website in websites]
    return "<br>".join(website_list)
