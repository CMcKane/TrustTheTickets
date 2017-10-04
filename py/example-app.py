
from flask import Flask
from flask import jsonify
from flask_mysqldb import MySQL

app = Flask (__name__)

mysql = MySQL(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'ttt'

# posts = [
#     {
#         'id': 1,
#         'title': u'Section 101 Row 10 Seat 12',
#         'description': u'Great seats',
#         'done': False
#     },
#     {
#         'id': 2,
#         'title': u'Nosebleeds',
#         'description': u'Terrible seats',
#         'done': False
#     }
# ]

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route('/users')
def index():
    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute("SELECT accountID, email, password, timestamp FROM accounts")
    posts = [dict(accountID=row[0], email=row[1], password=row[2], timestamp=row[3]) for row in cursor.fetchall()]
    return jsonify({'posts': posts})

if __name__ == '__main__':
    app.run()