from boto.s3.connection import S3Connection
from boto.s3.key import Key
import io

# Handles uplodaing and downloading of files for S3.
class S3Worker(object):

    # The initialization method.
    def __init__(self, accessKey, secretKey, bucketName):
        self.conn = S3Connection(accessKey, secretKey)
        self.bucket = self.conn.get_bucket(bucketName)

    # Uploads a file.
    def uploadFile(self, file, keyStr):
        k = Key(self.bucket)
        k.key = keyStr
        k.set_contents_from_file(file)

    # Downloads a file.
    def downloadFile(self, keyStr):
        k = Key(self.bucket)
        k.key = keyStr
        inputStream = io.BytesIO()
        k.get_contents_to_file(inputStream)
        return inputStream