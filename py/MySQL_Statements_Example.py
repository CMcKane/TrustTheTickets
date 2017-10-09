# This file is an example of ways to interface with the MySQL database in Python.
# We will have setup the DB Model using MySQL Workbench, so these specific SQL
# statements will NOT be excecuted from Python. They are just left here as
# syntax examples and for reference.

from flask import Flask,request
from flask_mysqldb import MySQL

app = Flask(__name__)
mysql = MySQL(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'trustthetickets-schema'


@app.route("/")
def main():
    return "MySQL Test Statements"
    conn = mysql.connection
    cursor = conn.cursor()

    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    cursor.execute("TRUNCATE TABLE `teams`")
    cursor.execute("TRUNCATE TABLE `wells fargo seating chart`")
    cursor.execute("TRUNCATE TABLE `games`")
    cursor.execute("TRUNCATE TABLE `locations`")
    cursor.execute("TRUNCATE TABLE `transactions`")
    cursor.execute("TRUNCATE TABLE `user`")
    cursor.execute("TRUNCATE TABLE `tickets`")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")

    cursor.execute("INSERT INTO `user` (accountID, username, password) VALUES (3, 'Anthony', 'toor')")
    cursor.execute("INSERT INTO `user` (accountID, username, password) VALUES (4, 'Derek', 'roto')")
    cursor.execute("INSERT INTO `user` (accountID, username, password) VALUES (5, 'Chris', 'toro')")
    cursor.execute("INSERT INTO `user` (accountID, username, password) VALUES (6, 'Curtis', 'troo')")
    cursor.execute("INSERT INTO `user` (accountID, username, password) VALUES (7, 'Tom', 'rtoo')")
    cursor.execute("INSERT INTO `user` (accountID, username, password) VALUES (8, 'Jon', 'orot')")

    for x in range (1, 10):
        for y in range (1, 50):
            query = "INSERT INTO `wells fargo seating chart` (sectionNumber, seatNumber) VALUES (%s, %s) " % (x, y)
            cursor.execute(query)

    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('76ers', '1', 'Philadelphia')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Celtics', '1', 'Boston')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Nets', '1', 'Brooklyn')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Knicks', '1', 'New York')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Raptors', '1', 'Toronto')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Warriors', '1', 'Oakland')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Clippers', '1', 'Los Angeles')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Lakers', '1', 'Los Angeles')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Phoenix Suns', '1', 'Phoenix')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Kings', '1', 'Sacramento')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Bulls', '1', 'Chicago')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Cavaliers', '1', 'Cleveland')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Pistons', '1', 'Detroit')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Pacers', '1', 'Indiana')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Bucks', '1', 'Milwaukee')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Mavericks', '1', 'Dallas')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Rockets', '1', 'Houston')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Grizzlies', '1', 'Memphis')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Pelicans', '1', 'New Orleans')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Spurs', '1', 'San Antonio')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Hawks', '1', 'Atlanta')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Hornets', '1', 'Charlotte')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Heat', '1', 'Miami')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Magic', '1', 'Orlando')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Wizards', '1', 'Washington')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Nuggets', '1', 'Denver')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Timberwolves', '1', 'Minnesota')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Trail Blazers', '1', 'Portland')")
    cursor.execute("INSERT INTO `teams` (teamName, sportTypeID, city) VALUES ('Jazz', '1', 'Utah')")

    cursor.execute("INSERT INTO `locations` (state, city, street, zip, seatingChartID) VALUES ('Pennsylvania', 'Philadelphia', '3601 S Broad Street, 19148)")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Massachusetts', 'Boston', '100 Legends Way', '02114')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('New York', 'Brooklyn', '620 Atlantic Ave', '11212')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('New York', 'New York', '4 Pennsylvania Plaza', '10001')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Canada', 'Toronto', '40 Bay St', '2')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('California', 'Oakland', '7000 Coliseum Way', '94621')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('California', 'Los Angeles', '1111 S Figueroa St', '90015')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('California', 'Los Angeles', ' 1111 S Figueroa St', '90015')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Arizona', 'Phoenix', '201 E Jefferson St', '85004')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('California', 'Sacramento', '500 David J Stern Walk', '95814')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Illinois', 'Chicago', '1901 W Madison St', '60612')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Ohio', 'Cleveland', '1 Center Ct', '44115')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Michigan', 'Detroit', '2645 Woodward Avenue', '48201')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Indiana', 'Indiana')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Wisconsin', 'Milwaukee')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Texas', 'Dallas')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Texas', 'Houston')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Tennessee', 'Memphis')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Lousiana', 'New Orleans')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Texas', 'San Antonio')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Georgia', 'Atlanta')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('North Carolina', 'Charlotte')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Florida', 'Miami')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Florida', 'Orlando')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Washington State', 'Washington')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Colorado', 'Denver')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Minnesota', 'Minnesota')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Oregon', 'Portland')")
    cursor.execute("INSERT INTO `locations` (state, city, street, zip) VALUES ('Utah', 'Utah')")

    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '1', '2')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '3', '4')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '5', '6')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '7', '8')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '9', '10')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '11', '12')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '13', '14')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '15', '16')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '17', '18')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '19', '20')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '21', '22')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '23', '24')")
    cursor.execute("INSERT INTO `games` (eventTypeID, sportTypeID, homeTeamID, awayTeamID) VALUES ('1', '1', '25', '26')")

    cursor.execute("SELECT * FROM user")


    data = cursor.fetchall()
    conn.commit()

    for i in data:
        print(i)

    return "Done"

if __name__ == "__main__":
    app.run()
