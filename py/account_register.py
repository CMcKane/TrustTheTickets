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
        existingAccount = SqlHandler.check_for_email(self.mysql, email)
        if existingAccount > 0:
           return True
        return False

    # Account confirmation
    def confirm_registration(self, data):
        registerResult = {'registrationStatus': True}
        registrationID = data['registrationID']
        success = SqlHandler.get_account_for_confirmation(self.mysql, registrationID)

        if not success:
            registerResult['errorMessage'] = ERROR_MESSAGES['REGISTRATION_CONFIRM_ERROR']
            registerResult['registrationStatus'] = False

        return registerResult

    def insert_account_registration(self, account):
        registrationID = uuid.uuid4().hex
        SqlHandler.insert_account_registration(self.mysql, account, registrationID)
        return registrationID
