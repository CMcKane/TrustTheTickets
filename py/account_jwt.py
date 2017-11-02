import datetime
import jwt
import json

SECRET_KEY = 'this_is_a_very_secret_key'

class JWTService(object):
    def encode_auth_token(self, user_id):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7, minutes=0, seconds=0),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                SECRET_KEY,
                algorithm='HS256'
            )
        except Exception as e:
            return e


    def validate_auth_token(self, token):
        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithm='HS256')
            if decoded_token['exp'] > int(datetime.datetime.utcnow().strftime("%s")):
                return True
            return False
            # Do something?
        except Exception as e:
            print(e)
            return False

    def refresh_token(self, token):
        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithm='HS256')
            if decoded_token['exp'] > int(datetime.datetime.utcnow().strftime("%s")):
                return self.encode_auth_token(decoded_token['sub']).decode('utf-8')
        except Exception as e:
            print(e)

    def get_account(self, token):
        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithm='HS256')
            return decoded_token['sub']
        except Exception as e:
            print(e)


