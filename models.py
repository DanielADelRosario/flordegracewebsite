from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Website(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    website_name = db.Column(db.String(100), nullable=False)
    color_scheme = db.Column(db.String(50), nullable=False)
    logo_picture = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<Website {self.website_name}>'
 