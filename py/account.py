# This class contains all of the data for an account.
class Account(object):

    def __init__(self, email, password, firstName, lastName, address, city, stateprovid, zipCode, countryid, phoneNumber):
        self.email = email
        self.password = password
        self.firstName = firstName
        self.lastName = lastName
        self.address = address
        self.city = city
        self.stateprovid = stateprovid
        self.zipCode = zipCode
        self.countryid = countryid
        self.phoneNumber = phoneNumber

