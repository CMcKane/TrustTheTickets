from boto.s3.connection import S3Connection
from boto.s3.key import Key

class S3Worker(object):

    accessKey = 'AKIAJ7IL7SELDW2C6LRQ'
    secretKey = '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'
    bucketName = 'ttt-ticket-bucket'

    def __init__(self):
        self.conn = S3Connection(S3Worker.accessKey, S3Worker.secretKey)
        self.bucket = self.conn.get_bucket(S3Worker.bucketName)


    def uploadFile(self, file, keyStr):
        k = Key(self.bucket)
        k.key = keyStr
        k.set_contents_from_file(file)