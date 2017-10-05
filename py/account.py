

class Account(object):

    def __init__(self, email, password):
        self.email = email
        self.password = password
        # Need to hash + salt passwords