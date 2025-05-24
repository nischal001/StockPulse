from app import db
from datetime import datetime

class Subscriber(db.Model):
    """Model for subscribers who sign up for the stock market news service"""
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    mobile_number = db.Column(db.String(20), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    trial_start_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    subscription_status = db.Column(db.String(20), default="trial")  # trial, monthly, quarterly, yearly, expired
    
    def __repr__(self):
        return f'<Subscriber {self.first_name} {self.last_name}>'
