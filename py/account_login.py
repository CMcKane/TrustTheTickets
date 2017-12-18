from account import Account
from sql_handler import SqlHandler
from account_jwt import JWTService

jwt_service = JWTService()

# This class is responsible with authenticating accounts.
class AccountAuthenticator(object):

    # The initialization method.
    def __init__(self, mysql):
        self.mysql = mysql

    # Authenticates that email and password entered by a user are valid.
    # param IN self - this class object.
    # param IN data - the email and password entered.
    # param OUT True if valid False if not.
    def authenticate_user(self, data):
        account = Account(data['email'], data['password'],'','','','','','','','')
        return self.verify_credentials(account)

    # Verifies the user credentials.
    # param IN self - this class object.
    # param IN account - the account to verify credentials for.
    # param OUT True if verfied False if not.
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
