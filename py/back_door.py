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
from collections import defaultdict
from itertools import groupby
from operator import itemgetter
from PyPDF2 import PdfFileWriter, PdfFileReader
from werkzeug.utils import secure_filename
import os
import configparser

# Use config file to get these values
config = configparser.ConfigParser()
config.read("config.ini")

configHost = config.get('mysql-config', 'Host')
configUser = config.get('mysql-config', 'User')
configPassword = config.get('mysql-config', 'Password')
configDB = config.get('mysql-config', 'DB')
configUploadFolder = config.get('py-app-config', 'UploadFolder')

app = Flask (__name__)
mysql = MySQL(app)

# Start app with values from config file
app.config['MYSQL_HOST'] = configHost
app.config['MYSQL_USER'] = configUser
app.config['MYSQL_PASSWORD'] = configPassword
app.config['MYSQL_DB'] = configDB
app.config['UPLOAD_FOLDER'] = configUploadFolder

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

@app.route('/split-pdf', methods=['POST'])
def splitPDF():
    files = request.files['pdf']

    #file = open(jsonData, "r")
    inputpdf = PdfFileReader(files)
    splitfiles = []

    for i in xrange(inputpdf.numPages):
        splitfiles.append(inputpdf.getPage(i))

    return splitfiles

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
        return requestNotSupported()

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
    jsondata = request.get_json()
    event_id = jsondata['eventID']
    sqlHandler = SqlHandler(mysql)
    tickets = sqlHandler.get_all_tickets(mysql, event_id)
    return jsonify({'tickets': tickets})

@app.route('/tickets', methods=['POST'])
def get_tickets():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    sectionNum = jsondata['section_number']
    event_id = jsondata['eventID']
    tickets = sqlHandler.get_tickets(sectionNum, event_id)
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
    minPrice = jsondata['minPrice']
    maxPrice = jsondata['maxPrice']
    sections = jsondata['sections']
    event_id = jsondata['eventID']
    tickets = sqlHandler.get_ticket_by_filter(minPrice, maxPrice, event_id, sections)
    return jsonify({'tickets': tickets})

@app.route('/pick-cheapest-ticket', methods=['POST'])
def pick_cheapest_ticket():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    event_id = jsondata['eventID']
    tickets = sqlHandler.get_cheapest_tickets_all_sections(event_id)
    sections = sqlHandler.get_cheapest_tickets_sections(event_id)
    return jsonify({'tickets': tickets,
                    'sections': sections})

@app.route('/get-cheap-ticket-any-section', methods=['POST'])
def get_cheapest_ticket_any_section():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    minPrice = jsondata['minPrice']
    maxPrice = jsondata['maxPrice']
    event_id = jsondata['eventID']
    tickets = sqlHandler.get_cheap_ticket_any_section(event_id, minPrice, maxPrice)
    sections = sqlHandler.get_sections_by_less_equal_price(event_id, minPrice, maxPrice)
    return jsonify({'tickets': tickets, 'sections': sections})

@app.route('/pick-expensive-ticket', methods=['POST'])
def get_expensive_ticket_sections():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    event_id = jsondata['eventID']
    tickets = sqlHandler.get_expensive_tickets_all_sections(event_id)
    sections = sqlHandler.get_sections_by_max_price(event_id)
    return jsonify({'tickets': tickets, 'sections': sections})

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

@app.route('/games-by-team', methods=['GET', 'POST'])
def games_by_team():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    team_id = jsondata['team_id']
    games = sqlHandler.get_games_by_team(team_id)
    return jsonify({'games': games})


@app.route('/pick-ticket-zone', methods=['POST'])
def pick_tickets_by_zone():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    event_id = jsondata['eventID']
    section_type_id = jsondata['section_type_id']
    tickets = sqlHandler.get_tickets_for_selected_sections(event_id, section_type_id)
    return jsonify({'tickets': tickets})

@app.route('/your-listings', methods=['POST'])
@require_token
def get_seller_listings():
    jsonData = request.get_json()
    try:
        jwt_service = JWTService()
        account_id = jwt_service.get_account(jsonData['token'])
        sqlHandler = SqlHandler(mysql)
        transactions = sqlHandler.get_seller_transactions(account_id)
        listings = sqlHandler.get_seller_tickets(account_id)
        # Concatenate the two arrays into one listings array to be consumed by frontend page
        return jsonify({'listings':listings + transactions, 'authenticated': True})
    except Exception as e:
        print(e)
        return jsonify({'authenticated': False})

@app.route('/your-purchases', methods=['POST'])
@require_token
def get_buyer_purchases():
    jsonData = request.get_json()
    try:
        jwt_service = JWTService()
        account_id = jwt_service.get_account(jsonData['token'])
        sqlHandler = SqlHandler(mysql)
        transactions = sqlHandler.get_buyer_transactions(account_id)
        return jsonify({'purchases': transactions, 'authenticated': True})
    except Exception as e:
        print(e)
        return jsonify({'authenticated': False})

@app.route('/update-listing', methods=['POST'])
@require_token
def update_listing():
    jsonData = request.get_json()
    try:
        jwt_service = JWTService()
        account_id = jwt_service.get_account(jsonData['token'])
        sqlHandler = SqlHandler(mysql)
        sqlHandler.update_group(jsonData['groupID'], jsonData['newPrice'])
        transactions = sqlHandler.get_seller_transactions(account_id)
        listings = sqlHandler.get_seller_tickets(account_id)
        # Concatenate the two arrays into one listings array to be consumed by frontend page
        return jsonify({'listings':listings + transactions, 'authenticated': True})
    except Exception as e:
        print(e)
        return jsonify({'authenticated': False})

@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    file = request.files['pdf']
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return ''

@app.route('/create-groups', methods=['POST'])
def create_groups():
    jsonData = request.get_json()
    tickets_list = jsonData['tickets']
    tickets_list = sorted(tickets_list, key = itemgetter('group_id'))
    groups = dict((k, list(g)) for k, g in groupby(tickets_list, key = itemgetter('group_id')))
    return jsonify({'groups': groups})

if __name__ == '__main__':
    app.run()