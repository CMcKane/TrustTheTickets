from account import Account
from email_client import TTTEmailClient
import uuid
import threading

ERROR_MESSAGES = {'REGISTRATION_ERROR': 'An error occurred during account registration.',
                  'REGISTRATION_CONFIRM_ERROR': 'Registration could not be confirmed',
                'DUPLICATE_EMAIL': 'This email address has already been registered.'}

class AccountRegistrator(object):

    def __init__(self, mysql):
        self.mysql = mysql

    # Initial account registration

    def register_account(self, data):
        account = Account(data['email'], data['password'])
        registerResult = {'registrationStatus': True}
        if self.check_for_email(account.email):
            registerResult['errorMessage'] = ERROR_MESSAGES['DUPLICATE_EMAIL']
            registerResult['registrationStatus'] = False
        else:
            try:
                registrationID = self.insert_account_registration(account)
                thr = threading.Thread(target = TTTEmailClient.send_confirmation,
                                       args=(account.email, registrationID))
                thr.start()
            except:
                registerResult['errorMessage'] = ERROR_MESSAGES['REGISTRATION_ERROR']
                registerResult['registrationStatus'] = False
        return registerResult

    def check_for_email(self, email):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM accounts WHERE email = '{}'".format(email))
        if len(cursor.fetchall()) > 0:
            return True
        return False


    # Account confirmation

    def confirm_registration(self, data):
        registerResult = {'registrationStatus': True}
        registrationID = data['registrationID']
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM accountregistration WHERE registrationID = '{}'".format(registrationID))
        registrations = [dict(registrationID=row[0], email=row[1], password=row[2]) for row in cursor.fetchall()]
        if len(registrations) == 1:
            self.insert_account(Account(registrations[0]['email'], registrations[0]['password']))
            return registerResult
        registerResult['errorMessage'] = ERROR_MESSAGES['REGISTRATION_CONFIRM_ERROR']
        registerResult['registrationStatus'] = False
        return registerResult

    def insert_account_registration(self, account):
        conn = self.mysql.connection
        cursor = conn.cursor()
        registrationID = uuid.uuid4().hex
        # Delete other records in this table for this email address
        cursor.execute("DELETE FROM accountregistration where email = '{}'".format(account.email))
        cursor.execute(
            "INSERT INTO accountregistration (registrationID, email, password) VALUES ('{}','{}','{}')"
                .format(registrationID, account.email, account.password))
        conn.commit()
        return registrationID

    def insert_account(self, account):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("INSERT INTO accounts (accountID, email, password) VALUES ('{}','{}','{}')"
                .format('101', account.email, account.password))
        # will get rid of this 101 once table IDs auto increment
        conn.commit()