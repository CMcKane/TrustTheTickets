from flask import Flask,request
from flask_mysqldb import MySQL
from flask import jsonify

app = Flask(__name__)
mysql = MySQL(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'trustthetickets-schema'

@app.route('/users')
def users():
    conn = mysql.connection
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM user")

    users = cursor.fetchall()

    return jsonify(users)

@app.route('/')
def main():
    return "You're home!"

if __name__ == "__main__":
    app.run()
