# TrustTheTickets

## Python

Download latest version of Python 3 (python 3.6.2)
https://www.python.org/downloads/
Download Pycharm (recommended but not necessary)
For pycharm make sure project interpreter is python 3
File -> Default Settings -> Project Interpreter
On command line run the following - pip3 install flask
(Pip is python package management tool, you can install any just about package via pip3 install ____)

### Python Packages to Install
Make sure that you have the following packages installed under File -> Default Settings -> Project Interpreter

- Flask
- Flask-MySQLdb
- mysqlclient

This list of dependencies will need to be updated during the course of the project.

#### Flask Library Install Issues

For any Mac user that may have future issues downloading Flask-MySQLdb, this worked for me - I followed these steps:

1. Modify file: /usr/local/bin/mysql_config
(If it's not located there you can determine its location by doing the following)
which mysql_config

Original Version:
\# Create options 
libs=\"-L$pkglibdir\" 
libs=\"$libs -l \"

Modify Version To:
\# Create options
libs=\"-L$pkglibdir\" 
libs=\"$libs -lmysqlclient -lssl -lcrypto\"

2. Add environment veriables
(brew info openssl)

export LDFLAGS=\"-L/usr/local/opt/openssl/lib\"
export CPPFLAGS=\"-I/usr/local/opt/openssl/include\"

3. Install mysqlclient
(pip3 install mysqlclient)

4. If the issue persists with this error...

ld: library not found for -lssl
    clang: error: linker command failed with exit code 1 (use -v to see invocation)
    error: command \'/usr/bin/clang\' failed with exit status 1

5. Fix it by installing PyMySQL
(pip3 install PyMySQL)

Hope this helps

## Mysql

If you’re not a command line person go here https://dev.mysql.com/downloads/installer/ . Otherwise read on..

### Mac users

This guideline works perfectly
If you don’t have Homebrew, go here first


### Windows people 🙄 

I know you Windows people hate command line so see above

## React

### Mac users

Install homebrew if you haven’t 
brew install node

### Windows

Install latest version of node.js

### After node installed (mac/windows users)

Navigate to js directory in project repo. On the command line run the following:
```
npm install
```
```
npm start
```
If you make changes to any JS files and save them your website will automatically reload to reflect those changes. 
