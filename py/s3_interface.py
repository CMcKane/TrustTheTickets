from boto.s3.connection import S3Connection
from boto.s3.key import Key

class S3Worker(object):

    def __init__(self, accessKey, secretKey, bucketName):
        self.conn = S3Connection(accessKey, secretKey)
        self.bucket = self.conn.get_bucket(bucketName)


    def uploadFile(self, file, keyStr):
        k = Key(self.bucket)
        k.key = keyStr
        k.set_contents_from_file(file)