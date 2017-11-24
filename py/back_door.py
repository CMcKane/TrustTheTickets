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
from s3_interface import S3Worker
from email_client import TTTEmailClient
import threading
import os
import configparser
import io

# Use config file to get these values
config = configparser.ConfigParser()
config.read("config.ini")

configHost = config.get('mysql-config', 'Host')
configUser = config.get('mysql-config', 'User')
configPassword = config.get('mysql-config', 'Password')
configDB = config.get('mysql-config', 'DB')
configUploadFolder = config.get('py-app-config', 'UploadFolder')
configAWSAccessKey = config.get('py-app-config', 'AWSAccessKey')
configAWSSecretKey = config.get('py-app-config', 'AWSSecretKey')
configAWSBucket = config.get('py-app-config', 'AWSBucket')

app = Flask (__name__)
mysql = MySQL(app)
s3worker = S3Worker(configAWSAccessKey, configAWSSecretKey, configAWSBucket)

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
    firstTicketId = int(request.values['startId'])
    lastTicketId = int(request.values['endId'])

    inputPDF = PdfFileReader(files)

    if lastTicketId - firstTicketId + 1 != inputPDF.numPages:
        print("ERROR: PDF does not have the same number of pages as the number of tickets being uploaded.")
        print("Tickets could not be uploaded.")
    else:
        for i in range(inputPDF.numPages):
            outputStream = io.BytesIO()
            output = PdfFileWriter()
            output.addPage(inputPDF.getPage(i))
            output.write(outputStream)
            outputStream.seek(0)
            s3worker.uploadFile(outputStream, str(firstTicketId + i))
    return ''

@app.route('/combine-pdf', methods=['POST'])
def combinePDF():
    if 'application/json' in request.headers.environ['CONTENT_TYPE']:
        jsonData = request.get_json()
        email = jsonData['email']
        ticketIds = jsonData['ticketIds']

        outputStream = io.BytesIO()
        output = PdfFileWriter()

        for i in ticketIds:
            curFileStream = io.BytesIO()
            curFileStream = s3worker.downloadFile(str(i))
            curInputPDF = PdfFileReader(curFileStream)
            output.appendPagesFromReader(curInputPDF)

        output.write(outputStream)
        outputStream.seek(0)

        thr = threading.Thread(target=TTTEmailClient.send_combined_ticket_file,
                               args=(email, outputStream, "Tickets.pdf"))
        thr.start()

    else:
        return requestNotSupported()
    return ''

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
    desiredNumberTickets = jsondata['desiredNumberTickets']
    sqlHandler = SqlHandler(mysql)
    tickets = sqlHandler.get_all_tickets(mysql, event_id, desiredNumberTickets)
    return jsonify({'tickets': tickets})

@app.route('/tickets', methods=['POST'])
def get_tickets():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    sectionNum = jsondata['section_number']
    event_id = jsondata['eventID']
    aisleSeat = jsondata['aisleSeat']
    earlyAccess = jsondata['earlyAccess']
    handicap = jsondata['handicap']
    desiredNumberTickets = jsondata['desiredNumberTickets']
    tickets = sqlHandler.get_tickets(sectionNum, event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
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
    aisleSeat = jsondata['aisleSeating']
    earlyAccess = jsondata['earlyAccess']
    handicap = jsondata['handicap']
    desiredNumberTickets = jsondata['desiredNumberTickets']
    tickets = sqlHandler.get_ticket_by_filter(minPrice, maxPrice, event_id, sections, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
    return jsonify({'tickets': tickets})

@app.route('/pick-cheapest-ticket', methods=['POST'])
def pick_cheapest_ticket():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    event_id = jsondata['eventID']
    aisleSeat = jsondata['aisleSeating']
    earlyAccess = jsondata['earlyAccess']
    handicap = jsondata['handicap']
    desiredNumberTickets = jsondata['desiredNumberTickets']
    tickets = sqlHandler.get_cheapest_tickets_all_sections(event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
    sections = sqlHandler.get_cheapest_tickets_sections(event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
    return jsonify({'tickets': tickets,
                    'sections': sections})

@app.route('/get-tickets-for-sections', methods=['POST'])
def get_tickets_for_sections():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    event_id = jsondata['eventID']
    sections = jsondata['sections']
    aisleSeat = jsondata['aisleSeating']
    earlyAccess = jsondata['earlyAccess']
    handicap = jsondata['handicap']
    desiredNumberTickets = jsondata['desiredNumberTickets']
    tickets = sqlHandler.get_tickets_for_sections(event_id, sections, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
    sections = []
    my_set = None
    for ticket in tickets:
        sections.append(ticket['section_number'])

    my_set = set(sections)
    sections = list(my_set)

    return jsonify({'tickets': tickets,
                    'sections': sections})

@app.route('/get-cheap-ticket-any-section', methods=['POST'])
def get_cheapest_ticket_any_section():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    minPrice = jsondata['minPrice']
    maxPrice = jsondata['maxPrice']
    event_id = jsondata['eventID']
    aisleSeat = jsondata['aisleSeating']
    earlyAccess = jsondata['earlyAccess']
    handicap = jsondata['handicap']
    desiredNumberTickets = jsondata['desiredNumberTickets']
    tickets = sqlHandler.get_cheap_ticket_any_section(event_id, minPrice, maxPrice, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
    # sections = sqlHandler.get_sections_by_less_equal_price(event_id, minPrice, maxPrice, aisleSeat, earlyAccess, handicap)

    sections = []
    my_set = None
    for ticket in tickets:
        sections.append(ticket['section_number'])

    my_set = set(sections)
    sections = list(my_set)


    return jsonify({'tickets': tickets, 'sections': sections})

@app.route('/pick-expensive-ticket', methods=['POST'])
def get_expensive_ticket_sections():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    event_id = jsondata['eventID']
    aisleSeat = jsondata['aisleSeating']
    earlyAccess = jsondata['earlyAccess']
    handicap = jsondata['handicap']
    desiredNumberTickets = jsondata['desiredNumberTickets']
    tickets = sqlHandler.get_expensive_tickets_all_sections(event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
    #sections = sqlHandler.get_sections_by_max_price(event_id, aisleSeat, earlyAccess, handicap)

    sections = []
    my_set = None
    for ticket in tickets:
        sections.append(ticket['section_number'])

    my_set = set(sections)
    sections = list(my_set)

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
    aisleSeat = jsondata['aisleSeat']
    earlyAccess = jsondata['earlyAccess']
    handicap = jsondata['handicap']
    desiredNumberTickets = jsondata['desiredNumberTickets']
    tickets = sqlHandler.get_tickets_for_selected_sections(event_id, section_type_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
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

@app.route('/hold-tickets', methods=['POST'])
@require_token
def hold_tickets():
    jsonData = request.get_json()
    try:
        jwt_service = JWTService()
        account_id = jwt_service.get_account(jsonData['token'])
        sqlHandler = SqlHandler(mysql)
        result = sqlHandler.hold_tickets(account_id, jsonData['ticketIds'])
        return jsonify({'authenticated': result, 'timer': 30000}) # 5 minutes
    except Exception as e:
        print(e)
        return jsonify({'authenticated': False})

@app.route('/cancel-listing', methods=['POST'])
@require_token
def cancel_listing():
    jsonData = request.get_json()
    try:
        jwt_service = JWTService()
        account_id = jwt_service.get_account(jsonData['token'])
        sqlHandler = SqlHandler(mysql)
        sqlHandler.cancel_group(jsonData['groupID'])
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

@app.route('/get-game-dates', methods=['GET'])
def game_dates():
    sqlHandler = SqlHandler(mysql)
    date = sqlHandler.get_game_dates()
    return jsonify({'date': date})

@app.route('/get-opponent-by-date', methods=['POST'])
def get_opponent_by_date():
    jsonData = request.get_json()
    date = jsonData['gameDate']
    sqlHandler = SqlHandler(mysql)
    opponentName = sqlHandler.get_opponent_by_date(date)
    return jsonify({'opponentName': opponentName})

@app.route('/get-country-names', methods=['GET'])
def get_country_names():
    sqlHandler = SqlHandler(mysql)
    countries = sqlHandler.get_country_names()
    return jsonify({'country': countries})

@app.route('/get-country-states', methods=['POST'])
def get_country_states():
    jsonData = request.get_json()
    country_id = jsonData['countryID']
    sqlHandler = SqlHandler(mysql)
    stateNames = sqlHandler.get_country_states(country_id)
    return jsonify({'stateNames': stateNames})

@app.route('/get-fees', methods=['GET'])
def get_fees():
    jsonData = request.get_json()
    sqlHandler = SqlHandler(mysql)
    percentages = sqlHandler.get_fees()
    return jsonify({'percentages': percentages})

@app.route('/insert-transaction', methods=['POST'])
def create_transaction():
    sqlHandler = SqlHandler(mysql)
    jsonData = request.get_json()
    jwt_service = JWTService()

    buyer_id = jwt_service.get_account(jsonData['token'])
    tickets = jsonData['tickets']
    commission = jsonData['commission']
    tax = jsonData['tax']
    subtotal = jsonData['subtotal']
    total = jsonData['total']
    group_id = jsonData['group_id']

    success = sqlHandler.create_transaction(buyer_id, tickets, commission, tax, subtotal, total, group_id)
    return jsonify({'success': success})

@app.route('/create-ticket-listing', methods=['POST'])
def insert_ticket_listing():
    sqlHandler = SqlHandler(mysql)
    jwt_service = JWTService()
    jsonData = request.get_json()

    sectionNum = jsonData['section']
    rowNum = jsonData['row']
    seatsInfo = jsonData['seatsInfo']
    ticketPrice = jsonData['ticketPrice']
    pdfLinks = jsonData['pdfLinks']
    numberOfTickets = jsonData['numberOfTickets']
    minPurchaseSize = jsonData['minPurchaseSize']
    gameDate = jsonData['dbGameDate']
    accountID = jwt_service.get_account(jsonData['token'])

    success = sqlHandler.insert_ticket_listing(sectionNum, rowNum, seatsInfo, ticketPrice, pdfLinks,
                                     numberOfTickets, minPurchaseSize, gameDate, accountID)

    return jsonify({'success' : success})

if __name__ == '__main__':
    app.run()