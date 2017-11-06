from logger import Logger
from passlib.hash import sha256_crypt

class SqlHandler(object):
    def __init__(self, mysql):
        self.mysql = mysql

    def get_tickets(self, sectionNum, event_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT t.ticket_id, r.row_num, s.seat_num, se.section_num, g.ticket_price "
                       "FROM tickets t  "
                       "JOIN sections se ON (t.section_id = se.section_id) "
                       "JOIN rows r ON (t.row_id = r.row_id) "
                       "JOIN seats s ON (t.seat_id = s.seat_id) "
                       "JOIN groups g USING (group_id)"
                       "WHERE t.event_id = '{}'"
                       "AND se.section_num = '{}' "
                       "ORDER BY row_num".format(event_id, sectionNum))
        tickets = [dict(ticket_id=row[0], row_number=row[1], seat_number=row[2],
                        section_number=row[3], ticket_price=row[4]) for row in
                   cursor.fetchall()]
        return tickets

    def get_all_tickets(self, mysql, eventID):
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT t.ticket_id, r.row_num, s.seat_num, se.section_num "
                       "FROM tickets t  "
                       "JOIN sections se ON (t.section_id = se.section_id) "
                       "JOIN rows r ON (t.row_id = r.row_id) "
                       "JOIN seats s ON (t.seat_id = s.seat_id) "
                       "WHERE t.event_id = '{}' "
                       "ORDER BY row_num".format(eventID))
        tickets = [dict(ticket_id=row[0], row_number=row[1], seat_number=row[2], section_number=row[3]) for row in
                   cursor.fetchall()]
        return tickets

    def get_account_info(self, account_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT first_name, last_name "
                       "FROM accounts "
                       "WHERE account_id = '{}'".format(account_id))
        cols = cursor.fetchone()
        account_info = dict(authenticated=True, firstName=cols[0], lastName=cols[1])
        return account_info

    def get_accounts(mysql):
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT account_id, email, created_dt, first_name, last_name FROM accounts")
        accounts = [dict(account_id=row[0], email=row[1], created_dt=row[2], fname=row[3], lname=row[4]) for row in
                    cursor.fetchall()]
        return accounts

    def check_for_email(self, email):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT account_id FROM accounts WHERE email = '{}'".format(email))
        return len(cursor.fetchall())

    def get_account_for_confirmation(self, registrationID):
        conn = self.mysql.connection
        cursor = conn.cursor()
        rowcount = cursor.execute(
            "SELECT account_id FROM account_registration WHERE registration_code = '{}'".format(registrationID))

        retVal = False
        if rowcount == 1:
            accountID = cursor.fetchone()[0]
            cursor.execute("UPDATE accounts SET account_status_id = 1 WHERE account_id = {}".format(accountID))
            cursor.execute("DELETE FROM account_registration WHERE account_id = {}".format(accountID))
            conn.commit()
            retVal = True
        return retVal

    def get_games_with_details(self, start_date, end_date):
        conn = self.mysql.connection
        cursor = conn.cursor()
        try:
            cursor.execute(
                "SELECT g.event_id, h.team_name AS 'Home Team', concat(h.team_name,' vs ', a.team_name) AS Title, "
                "a.team_name AS 'Away Team', date, date, COUNT(ticket_id) AS 'numTickets', "
                "MIN(ticket_price) AS 'minPrice'FROM games g "
                "JOIN teams h ON (h.team_id = home_team_id) "
                "JOIN teams a ON (a.team_id = away_team_id) "
                "LEFT JOIN tickets USING (event_id) "
                "LEFT JOIN groups USING (group_id) "
                "WHERE date > '{}' "
                "AND date < '{}' "
                "GROUP BY g.event_id;".format(start_date, end_date))
            event_details = [dict(id=row[0], homeTeam=row[1], title=row[2], awayTeam=row[3], start=row[4],
                                  end=row[5], numTickets=row[6], minPrice=row[7]) for row in
                             cursor.fetchall()]
            return event_details
        except Exception as e:
            print(e)

    def get_event(self, event_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        try:
            cursor.execute(
                "SELECT concat(h.team_name,' vs ', a.team_name) AS Title, "
                "h.team_name, "
                "a.team_name "
                "FROM games g "
                "JOIN teams h ON (h.team_id = home_team_id) "
                "JOIN teams a ON (a.team_id = away_team_id) "
                "WHERE g.event_id = '{}'"
                "GROUP BY g.event_id;".format(event_id))
            cols = cursor.fetchone()
            event_details = dict(authenticated=True, title=cols[0], awayTeam=cols[1], homeTeam=cols[2])
            return event_details
        except Exception as e:
            print(e)

    def insert_account_registration(self, account, registrationID):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(account_id) FROM accounts")
        newAccountID = cursor.fetchone()[0]
        if not newAccountID:
            newAccountID = 1
        else:
            newAccountID += 1
        hashedPass = sha256_crypt.hash(account.password)
        cursor.execute(
            "INSERT INTO accounts (account_id, email, password, account_status_id, created_dt, first_name, last_name, address, city, state_prov_id, zip, country_id, phone1 ) VALUES ('{}','{}','{}','{}', NOW(),'{}','{}','{}','{}','{}','{}','{}','{}')"
                .format(newAccountID, account.email, hashedPass, 2, account.firstName, account.lastName,
                        account.address, account.city, account.stateprovid, account.zipCode, account.countryid,
                        account.phoneNumber))
        cursor.execute(
            "INSERT INTO account_registration (account_id, registration_code) VALUES ('{}','{}')"
                .format(newAccountID, registrationID))
        conn.commit()

    def verify_credentials(self, email, password):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute(
            "SELECT first_name, last_name, password, account_id FROM accounts WHERE email = '{}'".format(email))
        cols = cursor.fetchone()
        if cols and sha256_crypt.verify(password, cols[2]):
            return dict(authenticated=True, firstName=cols[0], lastName=cols[1], account_id=cols[3])
        else:
            return {'authenticated': False}

    def get_teams_for_games(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.callproc("get_teams_for_games")
        data = [dict(home_team=row[0], home_city=row[1], away_team=row[2], away_city=row[3]) for row in
                cursor.fetchall()]
        return data

    def get_games_by_team(self, team_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT g.event_id, g.home_team_id, g.away_team_id, g.date, "
                       "home.team_name AS `home_team_name`, away.team_name AS `away_team_name` "
                       "FROM games g "
                       "JOIN teams home ON (g.home_team_id = home.team_id) "
                       "JOIN teams away ON (g.away_team_id = away.team_id) "
                       "WHERE away_team_id = '{}'".format(team_id))
        data = [dict(event_id=row[0], home_team_id=row[1], away_team_id=row[2], date=row[3],
                     home_team_name=row[4], away_team_name=row[5]) for row in cursor.fetchall()]
        return data

    def get_all_teams(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT team_id, city, team_name FROM teams WHERE sport_type_id = 1")
        data = [dict(team_id=row[0], city=row[1], team_name=row[2]) for row in cursor.fetchall()]
        return data

    def get_ticket_by_filter(self, price, event_id, sections):
        conn = self.mysql.connection
        cursor = conn.cursor()
        section_string = ""
        for i in range(0, len(sections)):
            if (i == len(sections)-1):
                section_string+="'{}'".format(sections[i])
            else:
                section_string+="'{}',".format(sections[i])
        cursor.execute("SELECT g.ticket_price, se.section_num, r.row_num, s.seat_num "
                       "FROM tickets t "
                       "JOIN groups g ON (t.group_id = g.group_id) "
                       "JOIN sections se ON (t.section_id = se.section_id) "
                       "JOIN rows r ON (t.row_id = r.row_id) "
                       "JOIN seats s ON (t.seat_id = s.seat_id) "
                       "WHERE g.ticket_price <= {} "
                       "AND t.event_id = '{}' "
                       "AND se.section_num IN ({})".format(price, event_id, section_string))
        tickets = [dict(ticket_price=row[0], section_number=row[1], row_number=row[2], seat_number=row[3]) for row in cursor.fetchall()]
        return tickets

    def get_cheap_ticket_any_section(self, event_id, price):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT g.ticket_price, se.section_num, r.row_num, s.seat_num "
                       "FROM tickets t "
                       "JOIN groups g ON (t.group_id = g.group_id) "
                       "JOIN sections se ON (t.section_id = se.section_id) "
                       "JOIN rows r ON (t.row_id = r.row_id) "
                       "JOIN seats s ON (t.seat_id = s.seat_id) "
                       "WHERE t.event_id ='{}' "
                       "AND g.ticket_price <= {}".format(price, event_id))
        tickets = [dict(ticket_price=row[0], section_number=row[1], row_number=row[2], seat_number=row[3]) for row in cursor.fetchall()]
        return tickets


    def get_sections_by_less_equal_price(self, event_id, price):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT se.section_num "
                       "FROM tickets t "
                       "JOIN groups g ON (t.group_id = g.group_id) "
                       "JOIN sections se ON (t.section_id = se.section_id) "
                       "WHERE t.event_id = '{}'"
                       "AND g.ticket_price <= '{}'".format(event_id, price))
        sections = []
        for row in cursor.fetchall():
            sections.append(row[0])
        return sections

    def get_sections_by_max_price(self, event_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT se.section_num "
                       "FROM tickets t "
                       "JOIN groups g ON (t.group_id = g.group_id) "
                       "JOIN sections se ON (t.section_id = se.section_id) "
                       "WHERE t.event_id = '{}'"
                       "AND g.ticket_price >= "
                       "    (SELECT max(ticket_price) FROM groups g WHERE g.event_id ='{}')".format(event_id, event_id))
        sections = []
        for row in cursor.fetchall():
            sections.append(row[0])
        return sections

    def get_cheapest_tickets_all_sections(self, event_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT ticket_price, section_num, row_num, seat_num "
                       "FROM tickets t "
                       "JOIN groups USING (group_id) "
                       "JOIN sections USING (section_id) "
                       "JOIN rows USING (row_id) "
                       "JOIN seats USING (seat_id) "
                       "WHERE t.event_id = '{}'"
                       "AND ticket_price <= (SELECT min(ticket_price) FROM groups g WHERE g.event_id ='{}')".format(event_id, event_id))
        tickets = [dict(ticket_price=row[0], section_number=row[1], row_number=row[2], seat_number=row[3]) for row in
                   cursor.fetchall()]
        return tickets

    def get_expensive_tickets_all_sections(self, event_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT ticket_price, section_num, row_num, seat_num "
                       "FROM tickets t "
                       "JOIN groups USING (group_id) "
                       "JOIN sections USING (section_id) "
                       "JOIN rows USING (row_id) "
                       "JOIN seats USING (seat_id) "
                       "WHERE t.event_id = '{}'"
                       "AND ticket_price >= (SELECT max(ticket_price) FROM groups g WHERE g.event_id = '{}')".format(event_id, event_id))
        tickets = [dict(ticket_price=row[0], section_number=row[1], row_number=row[2], seat_number=row[3]) for row in
                   cursor.fetchall()]
        return tickets

    def get_cheapest_tickets_sections(self, event_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT section_num "
                       "FROM tickets t "
                       "JOIN groups USING (group_id) "
                       "JOIN sections USING (section_id) "
                       "WHERE t.event_id ='{}'"
                       "AND ticket_price <= (SELECT min(ticket_price) FROM groups g WHERE g.event_id = '{}')".format(event_id, event_id))
        sections = []
        for row in cursor.fetchall():
            sections.append(row[0])
        return sections