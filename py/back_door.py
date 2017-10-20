from flask import Flask
from flask import jsonify
from flask_mysqldb import MySQL
from flask import request
from flask import make_response
from account_register import AccountRegistrator
from account_login import AccountAuthenticator
from sql_handler import SqlHandler;
from logger import Logger
app = Flask (__name__)

mysql = MySQL(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'ttt'

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

def requestNotSupported():
    return make_response(jsonify({'error': 'Unauthorized access'}), 401)

@app.route('/register', methods = ['POST'])
def register():
    if 'application/json' in request.headers.environ['CONTENT_TYPE']:
        jsonData = request.get_json()
        return jsonify(
            AccountRegistrator(mysql)
            .register_account(jsonData))
    else:
        return requestNotSupported()

@app.route('/registration-confirm', methods=['POST'])
def confirm_registration():
    if 'application/json' in request.headers.environ['CONTENT_TYPE']:
        jsonData = request.get_json()
        return jsonify(
            AccountRegistrator(mysql)
            .confirm_registration(jsonData))
    else:
        return requestNotSupported()

@app.route('/accounts')
def index():
    accounts = SqlHandler.get_accounts(mysql)
    return jsonify({'accounts': accounts})

@app.route('/tickets', methods=['POST'])
def get_tickets():
    givenSection = request.get_json()
    sectionNum = givenSection['section_number']
    tickets = SqlHandler.get_tickets(mysql, sectionNum)
    return jsonify({'tickets': tickets})

# Right now this just returns that the login info is good for testing purposes.
@app.route('/login', methods=['POST'])
def authenticate_credentials():
    if 'application/json' in request.headers.environ['CONTENT_TYPE']:
        jsonData = request.get_json()
        return jsonify(
            AccountAuthenticator(mysql)
            .authenticate_user(jsonData))
    else:
        return requestNotSupported()

if __name__ == '__main__':
    app.run()
