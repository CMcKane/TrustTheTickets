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

    def get_ticket_details(mysql, event_id):
        conn = mysql.connection
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT count(*) FROM tickets WHERE event_id = {}".format(event_id))
            numTickets = cursor.fetchone()[0]
            cursor.execute("SELECT MIN(ticket_price) FROM tickets JOIN groups USING (event_id)"
                       "WHERE event_id = {}".format(event_id))
            minPrice = cursor.fetchone()[0]
            return {'minPrice': str(minPrice), 'numTickets': str(numTickets), 'success': True}
        except Exception as e:
            print(e)

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