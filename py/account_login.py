from account import Account

class AccountAuthenticator(object):

    def __init__(self, mysql):
        self.mysql = mysql

    def authenticate_user(self, data):
        account = Account(data['email'], data['password'])
        return self.verify_credentials(account)

    def verify_credentials(self, account):
        conn = self.mysql.connection
        cursor = conn.cursor()
        rowcount = cursor.execute("SELECT first_name, last_name FROM accounts WHERE email = '{}' and password = '{}'".format(account.email, account.password))
        if rowcount == 1:
            cols = cursor.fetchone()
            return dict(authenticated=True, fname=cols[0], lname=cols[1])
        else:
            return {'authenticated' : True}