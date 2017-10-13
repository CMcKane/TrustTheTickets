from flask import Flask
from flask import jsonify
from flask_mysqldb import MySQL
from flask import request
from flask import make_response
<<<<<<< Updated upstream
from account_register import AccountRegistrator
from ticket_builder import TicketBuilder
=======
#from account_register import AccountRegistrator
#from ticket_builder import TicketBuilder
>>>>>>> Stashed changes

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
    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute("SELECT account_id, email, password, created_dt FROM accounts")
    accounts = [dict(account_id=row[0], email=row[1], password=row[2], created_dt=row[3]) for row in cursor.fetchall()]
    return jsonify({'accounts': accounts})

@app.route('/tickets', methods=['POST'])
def get_tickets():
    givenSection = request.get_json()
    sectionNum = givenSection['section_number']
    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute("SELECT ticket_id, row_number, seat_number, section_number FROM tickets WHERE section_number = '{}' ORDER BY row_number".format(sectionNum))
    tickets = [dict(ticket_id=row[0], row_number=row[1], seat_number=row[2], section_number=row[3]) for row in cursor.fetchall()]
    return jsonify({'tickets': tickets})

# Right now this just returns that the login info is good for testing purposes.
@app.route('/login', methods=['POST'])
def authenticate_credentials():
    return jsonify({'authenticated': True })

if __name__ == '__main__':
    app.run()