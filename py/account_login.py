from account import Account
from sql_handler import SqlHandler

class AccountAuthenticator(object):

    def __init__(self, mysql):
        self.mysql = mysql

    def authenticate_user(self, data):
        account = Account(data['email'], data['password'])
        return self.verify_credentials(account)

    def verify_credentials(self, account):
        return SqlHandler.verify_credentials(self.mysql, account.email, account.password)
