from flask import Flask,request
from flask_mysqldb import MySQL

app = Flask(__name__)
mysql = MySQL(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'trustthetickets-schema'

@app.route("/")
def main():

    conn = mysql.connection
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM user")

    data = cursor.fetchall()
    conn.commit()

    for i in data:
        print(i)

    return "Done"


if __name__ == "__main__":
    app.run()
