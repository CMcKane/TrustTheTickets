from account import Account
from sql_handler import SqlHandler
from account_jwt import JWTService

jwt_service = JWTService()

class AccountAuthenticator(object):

    def __init__(self, mysql):
        self.mysql = mysql

    def authenticate_user(self, data):
        account = Account(data['email'], data['password'],'','','','','','','','')
        return self.verify_credentials(account)

    def verify_credentials(self, account):
        sqlHandler = SqlHandler(self.mysql)
        loginResultDict = {'authenticated': False}
        try :
            loginResultDict = sqlHandler.verify_credentials(account.email, account.password)
            if (loginResultDict['authenticated']):
                jwt_token = jwt_service.encode_auth_token(loginResultDict['account_id'])
                loginResultDict['token'] = jwt_token.decode('utf-8')
        except Exception as e:
            print(e)
        return loginResultDict
