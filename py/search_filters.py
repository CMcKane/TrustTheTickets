from flask import Flask,request
from flask_mysqldb import MySQL

app = Flask(__name__)
mysql = MySQL(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'trustthetickets-schema'

#Establish connection with DB
conn = mysql.connection
cursor = conn.cursor()

#Filter the tickets between a min and max given from the user
# SELECT ticket_price, available_ticket_num, location_id, row_number, seat_number FROM ttt.groups LEFT JOIN ttt.tickets USING (group_id) WHERE ticket_price BETWEEN min AND max
def between_price(int min, int max):
    cursor.execute(
        "SELECT ticket_price, available_ticket_num, location_id, row_number, seat_number "
        "FROM ttt.groups "
        "LEFT JOIN ttt.tickets USING (group_id) "
        "WHERE ticket_price BETWEEN min AND max")
    tickets = [dict(ticket_price=row[0], available_ticket_num=row[1], location_id=row[2], row_number=row[3], seat_number=row[4]) for row in cursor.fetchall()]
    return jsonify({'filtered_tickets': tickets})

#Filter the tickets by price (ascending)
# SELECT ticket_price, available_ticket_num, location_id, row_number, seat_number FROM ttt.groups LEFT JOIN ttt.tickets USING (group_id) ORDER BY ticket_price ASC
def by_low_price():
    cursor.execute(
        "SELECT ticket_price, available_ticket_num, location_id, row_number, seat_number "
        "FROM ttt.groups "
        "LEFT JOIN ttt.tickets USING (group_id) "
        "ORDER BY ticket_price ASC")
    tickets = [dict(ticket_price=row[0], available_ticket_num=row[1], location_id=row[2], row_number=row[3],
                    seat_number=row[4]) for row in cursor.fetchall()]
    return jsonify({'filtered_tickets': tickets})

#Filter the tickets by price (descending)
# SELECT ticket_price, available_ticket_num, location_id, row_number, seat_number FROM ttt.groups LEFT JOIN ttt.tickets USING (group_id) ORDER BY ticket_price DESC
def by_high_price():
    cursor.execute(
        "SELECT ticket_price, available_ticket_num, location_id, row_number, seat_number "
        "FROM ttt.groups "
        "LEFT JOIN ttt.tickets USING (group_id) "
        "ORDER BY ticket_price DESC")
    tickets = [dict(ticket_price=row[0], available_ticket_num=row[1], location_id=row[2], row_number=row[3],
                    seat_number=row[4]) for row in cursor.fetchall()]
    return jsonify({'filtered_tickets': tickets})