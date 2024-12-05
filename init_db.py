import os

class Config:
    # Replace with your PostgreSQL username, password, and database name
    SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://postgres:itdobelikedatsometimes@127.0.0.1:5432/eduWebdb"

    # Disable tracking of modifications to objects (optional but recommended)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Optionally, set a secret key for session management (e.g., for flash messages, etc.)
    # SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key_here'

    # Optionally, enable or disable debug mode (set to True for development)
    DEBUG = True
