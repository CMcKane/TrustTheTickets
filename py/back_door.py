from flask import Flask
from flask import jsonify
from flask_mysqldb import MySQL
from flask import request
from flask import make_response
from flask import json
from account_register import AccountRegistrator
from account_login import AccountAuthenticator
from sql_handler import SqlHandler
from json_dictionary_converter import JsonDictionaryConverter
from account_jwt import JWTService
from functools import wraps
from collections import defaultdict
from itertools import groupby
from operator import itemgetter
from werkzeug.utils import secure_filename
from s3_interface import S3Worker
from pdf_interface import PDFWorker
from listing_creator import ListingCreator
from email_client import TTTEmailClient
import threading
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
configAWSAccessKey = config.get('py-app-config', 'AWSAccessKey')
configAWSSecretKey = config.get('py-app-config', 'AWSSecretKey')
configAWSBucket = config.get('py-app-config', 'AWSBucket')

app = Flask (__name__)
mysql = MySQL(app)
s3worker = S3Worker(configAWSAccessKey, configAWSSecretKey, configAWSBucket)
pdfworker = PDFWorker(s3worker)

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

@app.route('/send-tickets-pdf', methods=['POST'])
def sendTicketsPDF():
    if 'application/json' in request.headers.environ['CONTENT_TYPE']:
        jsonData = request.get_json()
        jwt_service = JWTService()
        sqlHandler = SqlHandler(mysql)
        try :
            accountID = jwt_service.get_account(jsonData['token'])
            email = sqlHandler.get_user_email(accountID)

            ticketIds = jsonData['ticketIds']
            outputPDF = pdfworker.getCombinedPDF(ticketIds)
            outputPDFName = "Tickets.pdf"

            thr = threading.Thread(target=TTTEmailClient.send_combined_ticket_file,
                               args=(email, outputPDF, outputPDFName))
            thr.start()
        except Exception as e:
            print(e)
            return jsonify({'success': False})
    else:
        return requestNotSupported()
    return jsonify({'success': True})

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

@app.route('/get-games-with-details', methods=['POST'])
def get_games_with_details():
    if 'application/json' in request.headers.environ['CONTENT_TYPE']:
        jsonData = request.get_json()
        sqlHandler = SqlHandler(mysql)
        eventDetails= sqlHandler.get_games_with_details(jsonData['start'], jsonData['end'])
        return jsonify({'eventDetails': eventDetails})

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

@app.route('/search-tickets-with-filter', methods=['POST'])
def search_tickets_with_filter():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    event_id = jsondata['eventID']
    minPrice = jsondata['minPrice']
    maxPrice = jsondata['maxPrice']

    earlyAccess = jsondata['earlyAccess']
    aisleSeat = jsondata['aisleSeat']
    handicap = jsondata['handicap']

    desiredNumberTickets = jsondata['desiredNumberTickets']

    tickets = sqlHandler.get_tickets_with_filter_all_sections(minPrice, maxPrice, event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets)

    sections = []
    my_set = None
    for ticket in tickets:
        sections.append(ticket['section_number'])

    my_set = set(sections)
    sections = list(my_set)
    return jsonify({'tickets': tickets, 'sections': sections})

@app.route('/search-tickets-in-sections-with-filter', methods=['POST'])
def search_tickets_in_sections_with_filter():
    sqlHandler = SqlHandler(mysql)
    jsondata = request.get_json()
    event_id = jsondata['eventID']
    sections = jsondata['sections']

    minPrice = jsondata['minPrice']
    maxPrice = jsondata['maxPrice']

    aisleSeat = jsondata['aisleSeat']
    earlyAccess = jsondata['earlyAccess']
    handicap = jsondata['handicap']

    desiredNumberTickets = jsondata['desiredNumberTickets']

    tickets = sqlHandler.get_tickets_in_sections_with_filter(event_id, sections, minPrice,
                        maxPrice, aisleSeat, earlyAccess, handicap, desiredNumberTickets)

    sections = []
    my_set = None
    for ticket in tickets:
        sections.append(ticket['section_number'])

    my_set = set(sections)
    sections = list(my_set)

    return jsonify({'tickets': tickets, 'sections': sections})

@app.route('/search-tickets-in-zone-with-filter', methods=['POST'])
def search_tickets_in_zone_with_filter():
    sqlHandler = SqlHandler(mysql)
    jsonData = request.get_json()

    event_id = jsonData['eventID']
    section_type_id = jsonData['section_type_id']

    minPrice = jsonData['minPrice']
    maxPrice = jsonData['maxPrice']

    aisleSeat = jsonData['aisleSeat']
    earlyAccess = jsonData['earlyAccess']
    handicap = jsonData['handicap']

    desiredNumberTickets = jsonData['desiredNumberTickets']

    tickets = sqlHandler.get_tickets_in_section_type_with_filter(event_id, section_type_id, minPrice, maxPrice, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
    return jsonify({'tickets': tickets})

# @app.route('/get-tickets-for-sections', methods=['POST'])
# def get_tickets_for_sections():
#     sqlHandler = SqlHandler(mysql)
#     jsondata = request.get_json()
#     event_id = jsondata['eventID']
#     sections = jsondata['sections']
#     aisleSeat = jsondata['aisleSeat']
#     earlyAccess = jsondata['earlyAccess']
#     handicap = jsondata['handicap']
#     desiredNumberTickets = jsondata['desiredNumberTickets']
#     tickets = sqlHandler.get_tickets_for_sections(event_id, sections, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
#     sections = []
#     my_set = None
#     for ticket in tickets:
#         sections.append(ticket['section_number'])
#
#     my_set = set(sections)
#     sections = list(my_set)
#
#     return jsonify({'tickets': tickets,
#                     'sections': sections})

# tickets = sqlHandler.get_ticket_by_filter(minPrice, maxPrice, event_id, sections, aisleSeat, earlyAccess, handicap, desiredNumberTickets)

# This route handles three different price modes
# "select" (gives a price range to select tickets between), "lowest", and "highest"
# the price mode is indicated by the priceMode field passed in the json,
#   and this price mode is passed on into the sqlhandler
# this route doesn't do anything special, it just serves as an endpoint
#   to pass on the relevent data from the front end to the back end
@app.route('/get-tickets-and-sections-by-price', methods=['POST'])
def get_tickets_and_sections_by_price():
    jsonData = request.get_json()

    sqlHandler = SqlHandler(mysql)
    event_id = jsonData['eventID']
    aisleSeat = jsonData['aisleSeat']
    earlyAccess = jsonData['earlyAccess']
    handicap = jsonData['handicap']
    desiredNumberTickets = jsonData['desiredNumberTickets']
    priceMode = jsonData['priceMode']
    minPrice = jsonData['priceRange']['min']
    maxPrice = jsonData['priceRange']['max']

    tickets = sqlHandler.get_tickets_by_price(
        event_id, aisleSeat, earlyAccess, handicap,
        desiredNumberTickets, priceMode, minPrice, maxPrice)

    if tickets:
        sections = []
        my_set = None
        for ticket in tickets:
            sections.append(ticket['section_number'])

        my_set = set(sections)
        sections = list(my_set)

        return jsonify({'tickets': tickets, 'sections': sections})
    else:
        return jsonify({'tickets': False})

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
@require_token
def create_transaction():
    sqlHandler = SqlHandler(mysql)
    jsonData = request.get_json()
    jwt_service = JWTService()

    buyer_id = jwt_service.get_account(jsonData['token'])
    event_id = jsonData['eventID']
    tickets = jsonData['tickets']
    commission = jsonData['commission']
    tax = jsonData['tax']
    subtotal = jsonData['subtotal']
    total = jsonData['total']
    group_id = jsonData['group_id']
    tax_per_ticket = jsonData['taxPerTicket']
    comm_per_ticket = jsonData['commPerTicket']
    subtotal_per_ticket = jsonData['subtotalPerTicket']

    success = sqlHandler.create_transaction(buyer_id, tickets, commission, tax, subtotal, total, group_id,
                                            tax_per_ticket, comm_per_ticket, subtotal_per_ticket)
    if success:
        event_info = sqlHandler.get_event_info(event_id)
        phone_num, email = sqlHandler.get_seller_email_and_phone(group_id)
        thr = threading.Thread(target=TTTEmailClient.send_sale_confirmation,
                               args=(email, event_info, tickets, commission, tax, subtotal, total))
        thr.start()

    return jsonify({'success': success})

@app.route('/unlock-tickets', methods=['POST'])
def unlock_tickets():
    jsonData = request.get_json()
    try:
        jwt_service = JWTService()
        #account_id = jwt_service.get_account(jsonData['token'])
        sqlHandler = SqlHandler(mysql)
        result = sqlHandler.unlock_tickets(jsonData['ticketIds'])
        return jsonify({'authenticated': result})  #
    except Exception as e:
        print(e)
        return jsonify({'authenticated': False})


@app.route('/send-listing-data', methods=['POST'])
def receiveListingData():
    file = request.files['pdf']
    jsonString = request.form['allJson']
    jsonData = json.loads(jsonString)

    listingcreator = ListingCreator(mysql, pdfworker, jsonData, file)
    success = listingcreator.createListing()

    return jsonify({'success': success})

@app.route('/validate-ticket-info', methods=['POST'])
def validateTicketInfo():
    jsonData = request.get_json()
    sectionNum = jsonData['sectionNum']
    rowNum = jsonData['rowNum']
    seatNums = jsonData['seatNums']
    gameDate = jsonData['gameDate']

    sqlHandler = SqlHandler(mysql)
    ticketInfoResults = sqlHandler.validate_ticket_info(sectionNum, rowNum, seatNums, gameDate)
    return jsonify({'ticketInfoResults': ticketInfoResults})

if __name__ == '__main__':
    app.run(host='0.0.0.0')
