from account import Account

ERROR_MESSAGES = {'REGISTRATION_ERROR': 'There was an error during registration.',
                'DUPLICATE_EMAIL': 'This email address has already been registered.'}

class AccountRegistrator(object):

    def __init__(self, mysql):
        self.mysql = mysql

    def register_account(self, data):
        account = Account(data['email'], data['password'])
        registerResult = {'registrationStatus': True}
        if self.check_for_email(account.email):
            registerResult['errorMessage'] = ERROR_MESSAGES['DUPLICATE_EMAIL']
            registerResult['registrationStatus'] = False
        else:
            self.insert_account(account)
            if not self.check_for_email(account.email):
                registerResult['errorMessage'] = ERROR_MESSAGES['REGISTRATION_ERROR']
                registerResult['registrationStatus'] = False
        return registerResult

    def insert_account(self, account):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO accounts (accountID, email, password) VALUES ('{}','{}','{}')"
                .format('12', account.email, account.password))
                # Need to have ID be generated somewhere to avoid conflict
        conn.commit()

    def check_for_email(self, email):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM accounts WHERE email = '{}'".format(email))
        if len(cursor.fetchall()) > 0:
            return True
        return False