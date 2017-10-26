from logger import Logger
from passlib.hash import sha256_crypt

class SqlHandler(object):

    def __init__(self, mysql):
        self.mysql = mysql

    def get_tickets(mysql, sectionNum):
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT ticket_id, row_number, seat_number, section_number FROM tickets WHERE section_number = '{}' ORDER BY row_number".format(sectionNum))
        tickets = [dict(ticket_id=row[0], row_number=row[1], seat_number=row[2], section_number=row[3]) for row in cursor.fetchall()]
        return tickets

    def get_accounts(mysql):
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT account_id, email, created_dt, first_name, last_name FROM accounts")
        accounts = [dict(account_id=row[0], email=row[1], created_dt=row[2], fname=row[3], lname=row[4]) for row in cursor.fetchall()]
        return accounts

    def check_for_email(mysql, email):
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT account_id FROM accounts WHERE email = '{}'".format(email))
        return len(cursor.fetchall())

    def get_account_for_confirmation(mysql, registrationID):
        conn = mysql.connection
        cursor = conn.cursor()
        rowcount = cursor.execute("SELECT account_id FROM account_registration WHERE registration_code = '{}'".format(registrationID))

        retVal = False
        if rowcount == 1:
            accountID = cursor.fetchone()[0]
            cursor.execute("UPDATE accounts SET account_status_id = 1 WHERE account_id = {}".format(accountID))
            cursor.execute("DELETE FROM account_registration WHERE account_id = {}".format(accountID))
            conn.commit()
            retVal = True

        return retVal

    def insert_account_registration(mysql, account, registrationID):
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(account_id) FROM accounts")
        newAccountID = cursor.fetchone()[0] + 1
        hashedPass = sha256_crypt.hash(account.password)
        cursor.execute(
            "INSERT INTO accounts (account_id, email, password, account_status_id, created_dt, first_name, last_name, address, city, state_prov_id, zip, country_id, phone1 ) VALUES ('{}','{}','{}','{}', NOW(),'{}','{}','{}','{}','{}','{}','{}','{}')"
                .format(newAccountID, account.email, hashedPass, 2, account.firstName, account.lastName, account.address, account.city, account.stateprovid, account.zipCode, account.countryid, account.phoneNumber))
        cursor.execute(
            "INSERT INTO account_registration (account_id, registration_code) VALUES ('{}','{}')"
                .format(newAccountID, registrationID))
        conn.commit()

    def verify_credentials(mysql, email, password):
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute(
         "SELECT first_name, last_name, password FROM accounts WHERE email = '{}'".format(email))
        cols = cursor.fetchone()
        if cols and sha256_crypt.verify(password, cols[2]):
            return dict(authenticated=True, firstName=cols[0], lastName=cols[1])
        else:
            return {'authenticated': False}

    def build_filter_select(mysql, dictionary):
        #query = "SELECT * FROM tickets t"
        conn = mysql.connection
        cursor = conn.cursor()
        join = ""
        on = ""
        where = ""
        section = ""
        date_from = ""
        date_to = ""
        date_range = False
        price_from = ""
        price_to = ""
        price_range = False

        if dictionary['section']:
            section = " section"

        if dictionary['date_from'] and dictionary['date_to']:
            join = " JOIN games g ON (t.event_id = g.event_id)"
            date_range = True

        if dictionary['price_from'] and dictionary['price_to']:
            join += " JOIN groups r ON (t.event_id = r.event_id)"
            price_range = True

        if date_range:
            where = " WHERE date BETWEEN ('2012-03-15' AND '2012-03-31')"

        query = "SELECT * FROM tickets t%s%s%s" % (join, where, " AND section_number =" + str(dictionary['section']))
        cursor.execute(query)
        fetch = cursor.fetchall()

        for row in fetch:
            print(row)

        return fetch

    def get_teams_for_games(mysql):
        data = None
        try:
            conn = mysql.connection
            cursor = conn.cursor()
            cursor.callproc('get_teams_for_games')
            data = cursor.fetchall()
        except:
            Logger.log("Unable to call procedure get_teams_for_games in method get_teams_for_games")

        return data

