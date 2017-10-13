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
        cursor.execute("SELECT account_id FROM accounts WHERE email = '{}'".format(email))
        if len(cursor.fetchall()) > 0:
            return True
        return False

    # Account confirmation
    def confirm_registration(self, data):
        registerResult = {'registrationStatus': True}
        registrationID = data['registrationID']
        conn = self.mysql.connection
        cursor = conn.cursor()
        rowcount = cursor.execute("SELECT account_id FROM account_registration WHERE registration_code = '{}'".format(registrationID))
        if rowcount == 1:
            accountID = cursor.fetchone()[0]
            cursor.execute("UPDATE accounts SET account_status_id = 1 WHERE account_id = {}".format(accountID))
            cursor.execute("DELETE FROM account_registration WHERE account_id = {}".format(accountID))
            conn.commit()
            return registerResult
        else:
            registerResult['errorMessage'] = ERROR_MESSAGES['REGISTRATION_CONFIRM_ERROR']
            registerResult['registrationStatus'] = False
            return registerResult

    def insert_account_registration(self, account):
        conn = self.mysql.connection
        cursor = conn.cursor()
        registrationID = uuid.uuid4().hex
        cursor.execute("SELECT MAX(account_id) FROM accounts")
        newAccountID = cursor.fetchone()[0] + 1
        cursor.execute(
            "INSERT INTO accounts (account_id, email, password, account_status_id, created_dt) VALUES ('{}','{}','{}','{}', NOW())"
                .format(newAccountID, account.email, account.password, 2))
        cursor.execute(
            "INSERT INTO account_registration (account_id, registration_code) VALUES ('{}','{}')"
                .format(newAccountID, registrationID))
        conn.commit()
        return registrationID