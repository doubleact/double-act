import sqlite3
import os
from datetime import datetime
from functools import wraps
import secrets
from base64 import b64encode
import hashlib

# Generate a random admin token (this will be printed when you run the server)
ADMIN_TOKEN = b64encode(secrets.token_bytes(32)).decode('utf-8')
# You can change this to a fixed value if you want a permanent token

def init_db():
    """Initialize the SQLite database"""
    with sqlite3.connect('tracking.db') as conn:
        conn.execute('''
        CREATE TABLE IF NOT EXISTS pageviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_agent TEXT,
            referrer TEXT
        )
        ''')

def require_admin(f):
    """Decorator to require admin token for certain routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import request, Response
        auth_token = request.headers.get('X-Admin-Token')
        if auth_token != ADMIN_TOKEN:
            return Response('Unauthorized', 401)
        return f(*args, **kwargs)
    return decorated_function

# Add these routes to your Flask app:
"""
from flask import jsonify, request

@app.route('/track', methods=['POST'])
def track_pageview():
    data = request.get_json()
    page = data.get('page', '')
    user_agent = request.headers.get('User-Agent', '')
    referrer = request.headers.get('Referer', '')
    
    with sqlite3.connect('tracking.db') as conn:
        conn.execute(
            'INSERT INTO pageviews (page, user_agent, referrer) VALUES (?, ?, ?)',
            [page, user_agent, referrer]
        )
    return jsonify({'success': True})

@app.route('/admin/stats')
@require_admin
def get_stats():
    with sqlite3.connect('tracking.db') as conn:
        conn.row_factory = sqlite3.Row
        
        # Get total views
        total = conn.execute('SELECT COUNT(*) as count FROM pageviews').fetchone()['count']
        
        # Get views per page
        pages = conn.execute('''
            SELECT page, COUNT(*) as count 
            FROM pageviews 
            GROUP BY page 
            ORDER BY count DESC
        ''').fetchall()
        
        # Get recent views
        recent = conn.execute('''
            SELECT * FROM pageviews 
            ORDER BY timestamp DESC 
            LIMIT 50
        ''').fetchall()
        
        return jsonify({
            'total': total,
            'pages': [dict(row) for row in pages],
            'recent': [dict(row) for row in recent]
        })
"""
