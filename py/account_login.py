from account import Account
from sql_handler import SqlHandler

class AccountAuthenticator(object):

    def __init__(self, mysql):
        self.mysql = mysql

    def authenticate_user(self, data):
        account = Account(data['email'], data['password'], data['firstName'], data['lastName'], data['address'], data['city'], data['stateprovid'], data['zipCode'], data['countryid'], data['phoneNumber'])
        return self.verify_credentials(account)

    def verify_credentials(self, account):
        sqlHandler = SqlHandler(self.mysql)
        return sqlHandler.verify_credentials(account.email, account.password)
