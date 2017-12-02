from account import Account
from email_client import TTTEmailClient
import uuid
import threading
from sql_handler import SqlHandler;

ERROR_MESSAGES = {'REGISTRATION_ERROR': 'An error occurred during account registration.',
                  'REGISTRATION_CONFIRM_ERROR': 'Registration could not be confirmed',
                  'DUPLICATE_EMAIL': 'This email address has already been registered.'}

class AccountRegistrator(object):

    def __init__(self, mysql):
        self.mysql = mysql

    # Initial account registration
    def register_account(self, data):
        account = Account(data['email'], data['password'],
                          data['firstName'], data['lastName'],
                          data['address'], data['city'],
                          data['stateprovid'], data['zipCode'],
                          data['countryid'], data['phoneNumber'])
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
            except Exception as e:
                print(e)
                registerResult['errorMessage'] = ERROR_MESSAGES['REGISTRATION_ERROR']
                registerResult['registrationStatus'] = False
        return registerResult


    def check_for_email(self, email):
        sqlHandler = SqlHandler(self.mysql)
        existingAccount = sqlHandler.check_for_email(email)
        if existingAccount > 0:
           return True
        return False

    # Account confirmation
    def confirm_registration(self, data):
        registerResult = {'registrationStatus': True}
        registrationID = data['registrationID']
        sqlHandler = SqlHandler(self.mysql)
        success = sqlHandler.get_account_for_confirmation(registrationID)

        if not success:
            registerResult['errorMessage'] = ERROR_MESSAGES['REGISTRATION_CONFIRM_ERROR']
            registerResult['registrationStatus'] = False

        return registerResult

    def insert_account_registration(self, account):
        registrationID = uuid.uuid4().hex
        sqlHandler = SqlHandler(self.mysql)
        sqlHandler.insert_account_registration(account, registrationID)
        return registrationID
