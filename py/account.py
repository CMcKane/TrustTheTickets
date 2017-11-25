#from passlib.hash import sha256_crypt

class Account(object):

    def __init__(self, email, password):
        self.email = email
        self.password = password
        # Hashes and salts password
        # self.password = sha256_crypt.hash(password)