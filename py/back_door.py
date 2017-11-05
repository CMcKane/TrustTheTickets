from flask import Flask
from flask import jsonify
from flask_mysqldb import MySQL
from flask import request
from flask import make_response
from account_register import AccountRegistrator
from account_login import AccountAuthenticator
from sql_handler import SqlHandler
from json_dictionary_converter import JsonDictionaryConverter
from account_jwt import JWTService
from functools import wraps

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

def require_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        jwt_service = JWTService()
        jsonData = request.get_json()
        id_token = jsonData['token']
        if id_token and jwt_service.validate_auth_token(id_token):
            return f(*args, **kwargs)
        else:
            return requestNotSupported()
    return decorated_function

def requestNotSupported():
    return make_response(jsonify({'error': 'Invalid token',
                                  'authenticated': False}))

@app.route('/token-refresh', methods = ['POST'])
@require_token
def refresh_token():
    if 'application/json' in request.headers.environ['CONTENT_TYPE']:
        jsonData = request.get_json()
        jwt_service = JWTService()
        token =  jwt_service.refresh_token(jsonData['token'])
        if token:
            return jsonify({'token': token, 'authenticated': True})
        else:
            return jsonify({'authenticated': False})
    else:
        return requestNotSupported();

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

@app.route('/my-account', methods=['POST'])
@require_token
def get_account_info():
    if 'application/json' in request.headers.environ['CONTENT_TYPE']:
        jsonData = request.get_json()
        try:
            jwt_service = JWTService()
            account_id = jwt_service.get_account(jsonData['token'])
            sqlHandler = SqlHandler(mysql)
            return jsonify(sqlHandler.get_account_info(account_id))
        except Exception as e:
            return jsonify({'authenticated': False})

@app.route('/accounts')
def index():
    sqlHandler = SqlHandler(mysql)
    accounts = sqlHandler.get_accounts()
    return jsonify({'accounts': accounts})

@app.route('/ticket-details', methods=['POST'])
def get_ticket_details():
    if 'application/json' in request.headers.environ['CONTENT_TYPE']:
        jsonData = request.get_json()
        sqlHandler = SqlHandler(mysql)
        eventDetails= sqlHandler.get_games_with_details(jsonData['start'], jsonData['end'])
        return jsonify({'eventDetails': eventDetails})

@app.route('/all-tickets', methods=['POST'])
def get_all_tickets():
    givenEventID = request.get_json()
    eventID = givenEventID['event_id']
    sqlHandler = SqlHandler(mysql)
    tickets = sqlHandler.get_all_tickets(mysql, eventID)
    return jsonify({'tickets': tickets})

@app.route('/tickets', methods=['POST'])
def get_tickets():
    json = ["2012-03-15", "2012-03-15", 290, 325, 112]
    #SqlHandler.build_filter_select(mysql,
     #   JsonDictionaryConverter.build_filter_dictionary(json))
    sqlHandler = SqlHandler(mysql)
    givenSection = request.get_json()
    sectionNum = givenSection['section_number']
    tickets = sqlHandler.get_tickets(sectionNum)
    return jsonify({'tickets': tickets})

@app.route('/get-event', methods=['POST'])
def get_event():
    jsondata = request.get_json()
    eventID = jsondata['eventID']
    sqlHandler = SqlHandler(mysql)
    event = sqlHandler.get_event(eventID)
    return jsonify({'event': event})

@app.route('/pick-ticket-filter', methods=['POST'])
def pick_tickets_by_filter():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    price = jsondata['price']
    section = jsondata['section']
    tickets = sqlHandler.get_ticket_by_filter(price, section)
    return jsonify({'tickets': tickets})

@app.route('/pick-cheapest-ticket', methods=['GET'])
def pick_cheapest_ticket():
    sqlHandler = SqlHandler(mysql)
    tickets = sqlHandler.get_cheapest_tickets_all_sections()
    return jsonify({'tickets': tickets})

@app.route('/get-cheap-ticket-any-section', methods=['POST'])
def get_cheapest_ticket_any_section():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    price = jsondata['price']
    tickets = sqlHandler.get_cheap_ticket_any_section(price)
    return jsonify({'tickets': tickets})

@app.route('/get-sections-by-less-equal-price', methods=['POST'])
def get_sections_by_less_equal_price():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    price = jsondata['price']
    sections = sqlHandler.get_sections_by_less_equal_price(price)
    return jsonify({'sections': sections})

@app.route('/get-cheapest-ticket-sections', methods=['GET'])
def get_cheapest_ticket_sections():
    sqlHandler = SqlHandler(mysql)
    sections = sqlHandler.get_cheapest_tickets_sections()
    return jsonify({'sections': sections})

@app.route('/pick-expensive-ticket', methods=['GET'])
def get_expensive_ticket_sections():
    sqlHandler = SqlHandler(mysql)
    tickets = sqlHandler.get_expensive_tickets_all_sections()
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
    sqlHandler = SqlHandler(mysql)
    games = sqlHandler.get_teams_for_games()
    return jsonify({'games': games})

@app.route('/all-teams', methods=['GET', 'POST'])
def all_teams():
    sqlHandler = SqlHandler(mysql)
    teams = sqlHandler.get_all_teams()
    return jsonify({'teams': teams})

if __name__ == '__main__':
    app.run()




