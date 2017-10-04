
from flask import Flask
from flask import jsonify

app = Flask (__name__)

posts = [
    {
        'id': 1,
        'title': u'Section 101 Row 10 Seat 12',
        'description': u'Great seats',
        'done': False
    },
    {
        'id': 2,
        'title': u'Nosebleeds',
        'description': u'Terrible seats',
        'done': False
    }
]

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route('/users')
def index():
    return jsonify({'posts': posts})

if __name__ == '__main__':
    app.run()