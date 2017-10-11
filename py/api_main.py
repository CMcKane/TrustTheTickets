from flask import Flask
from flask import jsonify
from flask_mysqldb import MySQL
from flask import request
from flask import make_response
from account_register import AccountRegistrator
from ticket_builder import TicketBuilder

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

@app.route('/users')
def index():
    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute("SELECT accountID, email, password, timestamp FROM accounts")
    users = [dict(accountID=row[0], email=row[1], password=row[2], timestamp=row[3]) for row in cursor.fetchall()]
    return jsonify({'users': users})

@app.route('/tickets')
def get_tickets():
    tickets = [dict(    ticketID        = index.ticketID,
                        seller          = index.seller,
                        eventType       = index.eventType,
                        event           = index.event,
                        location        = index.location,
                        seatingChart    = index.seatingChart,
                        price           = index.price,
                        section         = index.section,
                        seat            = index.seat
            )for index in TicketBuilder.tickets]

    return jsonify({'tickets': tickets})

# Right now this just returns that the login info is good for testing purposes.
@app.route('/login', methods=['POST'])
def authenticate_credentials():
    return jsonify({'authenticated': True })

if __name__ == '__main__':
    app.run()
