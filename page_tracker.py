from flask import Flask, jsonify, request, render_template, Response
import sqlite3
import secrets
from base64 import b64encode
from functools import wraps
import os

app = Flask(__name__)

# Generate a random admin token (this will be printed when you start the server)
ADMIN_TOKEN = b64encode(secrets.token_bytes(32)).decode('utf-8')

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
        auth_token = request.headers.get('X-Admin-Token')
        if auth_token != ADMIN_TOKEN:
            return Response('Unauthorized', 401)
        return f(*args, **kwargs)
    return decorated_function

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

@app.route('/admin')
@require_admin
def admin_page():
    return render_template('admin_stats.html')

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

if __name__ == '__main__':
    # Create the database and tables
    init_db()
    
    # Print the admin token
    print('\n' + '='*50)
    print('YOUR ADMIN TOKEN (save this):')
    print(ADMIN_TOKEN)
    print('='*50 + '\n')
    
    # Start the server
    app.run(port=5001)  # Using port 5001 to avoid conflicts with your main server
