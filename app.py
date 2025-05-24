import os
import logging
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
# create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)  # needed for url_for to generate with https

# Configure SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///subscribers.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the app with the extension
db.init_app(app)

logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """Render the home page"""
    return render_template('index.html')

@app.route('/terms')
def terms():
    """Render the terms and conditions page"""
    return render_template('terms.html')

@app.route('/privacy')
def privacy():
    """Render the privacy policy page"""
    return render_template('privacy.html')

@app.route('/submit-form', methods=['POST'])
def submit_form():
    """Handle form submission and store data"""
    try:
        # Get form data
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        mobile_number = request.form.get('mobile_number')
        
        if not first_name or not last_name or not mobile_number:
            flash('All fields are required!', 'error')
            return redirect(url_for('index'))
        
        # Create new subscriber
        from models import Subscriber
        subscriber = Subscriber(
            first_name=first_name,
            last_name=last_name,
            mobile_number=mobile_number
        )
        
        db.session.add(subscriber)
        db.session.commit()
        
        # Try to save to Google Sheets if credentials are available
        try:
            # This part would normally use credentials but we'll make it optional
            # as the blueprint doesn't specify Google Sheets credentials
            pass
        except Exception as e:
            logger.error(f"Failed to save to Google Sheets: {str(e)}")
        
        # Construct WhatsApp link
        whatsapp_number = os.environ.get("WHATSAPP_NUMBER", "918888888888")  # Default example number
        whatsapp_message = f"Hi, I'm {first_name} {last_name} and I'm interested in the free trial for your stock market news service."
        whatsapp_link = f"https://wa.me/{whatsapp_number}?text={whatsapp_message}"
        
        flash('Thank you for signing up! You will be redirected to WhatsApp to start your free trial.', 'success')
        return jsonify({"success": True, "whatsapp_link": whatsapp_link})
    
    except Exception as e:
        logger.error(f"Error in form submission: {str(e)}")
        flash('There was an error processing your request. Please try again.', 'error')
        return jsonify({"success": False, "error": str(e)}), 400

with app.app_context():
    # Import models and create tables
    from models import Subscriber
    db.create_all()
