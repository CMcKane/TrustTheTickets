import os

directory_path = "../debug"
file_path = "../debug/log.txt"

class Logger(object):
    file = 0

    def __init__(self):
        if not os.path.exists(directory_path):
            os.mkdir(directory_path)

        try:
            self.file = open(file_path, 'r')
            self.file.write("")
        except IOError:
            self.file = open(file_path, 'w')



    def log(message):
        file = open(file_path, 'a+')
        file.write(message + "\n\n")
        file.close()