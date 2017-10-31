from flask import Flask
from flask import jsonify
from flask_mysqldb import MySQL
from flask import request
from flask import make_response
from account_register import AccountRegistrator
from account_login import AccountAuthenticator
from sql_handler import SqlHandler;
from json_dictionary_converter import JsonDictionaryConverter


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

@app.route('/ticket-details', methods=['POST'])
def get_ticket_details():
    if 'application/json' in request.headers.environ['CONTENT_TYPE']:
        jsonData = request.get_json()
        eventDetails= SqlHandler.get_games_with_details(mysql, jsonData['start'], jsonData['end'])
        return jsonify({'eventDetails': eventDetails})

@app.route('/all-tickets', methods=['POST'])
def get_all_tickets():
    json = ["2012-03-15", "2012-03-15", 290, 325, 112]
    #SqlHandler.build_filter_select(mysql,
    #   JsonDictionaryConverter.build_filter_dictionary(json))

    givenEventID = request.get_json()
    eventID = givenEventID['event_id']
    tickets = SqlHandler.get_all_tickets(mysql, eventID)
    return jsonify({'tickets': tickets})

@app.route('/tickets', methods=['POST'])
def get_tickets():
    json = ["2012-03-15", "2012-03-15", 290, 325, 112]
    #SqlHandler.build_filter_select(mysql,
     #   JsonDictionaryConverter.build_filter_dictionary(json))

    givenSection = request.get_json()
    sectionNum = givenSection['section_number']
    tickets = SqlHandler.get_tickets(mysql, sectionNum)
    return jsonify({'tickets': tickets})

@app.route('/pick-ticket-filter', methods=['POST'])
def pick_tickets_by_filter():
    jsondata = request.get_json()
    price = jsondata['price']
    section = jsondata['section']
    tickets = SqlHandler.get_ticket_by_filter(mysql, price, section)
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

@app.route('/games')
def get_games_list():
    games = SqlHandler.get_teams_for_games(mysql)
    return jsonify({'games': games})

if __name__ == '__main__':
    app.run()




