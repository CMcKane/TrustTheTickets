from passlib.hash import sha256_crypt

class SqlHandler(object):
    def __init__(self, mysql):
        self.mysql = mysql

    def get_tickets(self, sectionNum, event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()

        whereStr = "WHERE t.event_id = '{}' AND se.section_num = '{}' AND t.ticket_status_id = 1 "


        if int(desiredNumberTickets) >= 10:
            whereStr += "AND g.available_ticket_num >= 10 "
        elif int(desiredNumberTickets) is not 0:
            whereStr += "AND g.available_ticket_num = %s " % (desiredNumberTickets)


        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        whereStr += "ORDER BY row_num"
        query = "SELECT t.ticket_id, r.row_num, s.seat_num, se.section_num, g.ticket_price, t.group_id, t.is_aisle_seat, t.is_early_entry, t.is_ha " \
                "FROM tickets t " \
                "JOIN sections se ON (t.section_id = se.section_id) JOIN rows r ON (t.row_id = r.row_id) " \
                "JOIN seats s ON (t.seat_id = s.seat_id) " \
                "JOIN groups g USING (group_id) %s" % (whereStr)


        cursor.execute(query.format(event_id, sectionNum))


        tickets = [dict(ticket_id=row[0], row_number=row[1], seat_number=row[2],
                        section_number=row[3], ticket_price=row[4], group_id=row[5],
                        aisle_seat=row[6], early_access=row[7], handicap=row[8]) for row in cursor.fetchall()]
        return tickets

    def get_all_tickets(self, mysql, eventID, desiredNumberTickets):
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT t.ticket_id, r.row_num, s.seat_num, se.section_num, g.ticket_price "
                       "FROM tickets t  "
                       "JOIN sections se ON (t.section_id = se.section_id) "
                       "JOIN rows r ON (t.row_id = r.row_id) "
                       "JOIN seats s ON (t.seat_id = s.seat_id) "
                       "JOIN groups g USING (group_id)"
                       "WHERE t.event_id = '{}' "
                       "AND t.ticket_status_id = 1 "
                       "AND min_sell_num <= '{}' "
                       "ORDER BY row_num".format(eventID, desiredNumberTickets))
        tickets = [dict(ticket_id=row[0], row_number=row[1], seat_number=row[2],
                        section_number=row[3], ticket_price=row[4]) for row in
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
                "SELECT concat(a.team_name,' vs ', h.team_name) AS Title, "
                "h.team_name, "
                "a.team_name,"
                "count(ticket_id),"
                "MIN(ticket_price) "
                "FROM games g "
                "JOIN teams h ON (h.team_id = home_team_id) "
                "JOIN teams a ON (a.team_id = away_team_id) "
                "JOIN tickets USING (event_id) "
                "JOIN groups USING (group_id) "
                "WHERE g.event_id = '{}'"
                "GROUP BY g.event_id;".format(event_id))
            cols = cursor.fetchone()
            event_details = dict(authenticated=True, title=cols[0],
                                 awayTeam=cols[1], homeTeam=cols[2],
                                 numTickets=cols[3], minPrice=cols[4])
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
            "SELECT first_name, last_name, password, account_id, account_status_desc FROM accounts "
            "JOIN account_status USING (account_status_id)"
            "WHERE email = '{}'".format(email))
        cols = cursor.fetchone()
        if cols and sha256_crypt.verify(password, cols[2]) and cols[4] == 'Active' :
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
                       "WHERE g.date > CURRENT_TIMESTAMP "
                       "AND away_team_id = '{}'".format(team_id))
        data = [dict(event_id=row[0], home_team_id=row[1], away_team_id=row[2], date=row[3],
                     home_team_name=row[4], away_team_name=row[5]) for row in cursor.fetchall()]
        return data

    def get_all_teams(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        # by specifying team_id != 23, we are excluding the 76ers from this query
        cursor.execute("SELECT team_id, city, team_name FROM teams WHERE sport_type_id = 1 AND team_id != 23")
        data = [dict(team_id=row[0], city=row[1], team_name=row[2]) for row in cursor.fetchall()]
        return data

    def get_ticket_by_filter(self, minPrice, maxPrice, event_id, sections,
                             aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()
        section_string = ""

        whereStr = "WHERE g.ticket_price >= '{}' " \
                   "AND g.ticket_price <= '{}' " \
                   "AND t.event_id = '{}' " \
                   "AND t.ticket_status_id = 1 " \
                   "AND se.section_num IN ({}) "

        if int(desiredNumberTickets) >= 10:
            whereStr += "AND g.available_ticket_num >= 10 "
        elif int(desiredNumberTickets) is not 0:
            whereStr += "AND g.available_ticket_num = %s " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        for i in range(0, len(sections)):
            if (i == len(sections)-1):
                section_string+="'{}'".format(sections[i])
            else:
                section_string+="'{}',".format(sections[i])

        query = "SELECT  g.ticket_price, se.section_num, r.row_num, s.seat_num, t.group_id, t.ticket_id,  " \
                "t.is_early_entry, t.is_aisle_seat, t.is_ha, t.ticket_id " \
                "FROM tickets t " \
                "JOIN groups g ON (t.group_id = g.group_id) " \
                "JOIN sections se ON (t.section_id = se.section_id) " \
                "JOIN rows r ON (t.row_id = r.row_id) " \
                "JOIN seats s ON (t.seat_id = s.seat_id) %s" % (whereStr)

        cursor.execute(query.format(minPrice, maxPrice, event_id, section_string))
        tickets = [dict(ticket_price=row[0], section_number=row[1],
                        row_number=row[2], seat_number=row[3],
                        group_id=row[4], ticket_id=row[5],
                        early_access=row[6], aisle_seat=row[7], handicap=row[8], id=row[9]) for row in cursor.fetchall()]
        return tickets

    def get_cheap_ticket_any_section(self, event_id, minPrice, maxPrice, aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()

        whereStr = "WHERE t.event_id ='{}' " \
                   "AND g.ticket_price >= '{}' " \
                   "AND g.ticket_price <= '{}' " \
                   "AND t.ticket_status_id = 1 "

        if int(desiredNumberTickets) >= 10:
            whereStr += "AND g.available_ticket_num >= 10 "
        elif int(desiredNumberTickets) is not 0:
            whereStr += "AND g.available_ticket_num = %s " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        query = "SELECT g.ticket_price, se.section_num, r.row_num, s.seat_num, t.group_id, t.ticket_id, " \
                "t.is_early_entry, t.is_aisle_seat, t.is_ha " \
                "FROM tickets t " \
                "JOIN groups g ON (t.group_id = g.group_id) " \
                "JOIN sections se ON (t.section_id = se.section_id) " \
                "JOIN rows r ON (t.row_id = r.row_id) " \
                "JOIN seats s ON (t.seat_id = s.seat_id) %s" % (whereStr)

        cursor.execute(query.format(event_id, minPrice, maxPrice))
        tickets = [dict(ticket_price=row[0], section_number=row[1],
                        row_number=row[2], seat_number=row[3],
                        group_id=row[4], ticket_id=row[5],
                        early_access=row[6], aisle_seat=row[7], handicap=row[8]) for row in cursor.fetchall()]
        return tickets


    def get_sections_by_less_equal_price(self, event_id, minPrice, maxPrice, aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()

        whereStr = "WHERE t.event_id = '{}' " \
                   "AND g.ticket_price >= '{}' " \
                   "AND g.ticket_price <= '{}' " \
                   "AND t.ticket_status_id = 1 "

        if int(desiredNumberTickets) >= 10:
            whereStr += "AND g.available_ticket_num >= 10 "
        elif int(desiredNumberTickets) is not 0:
            whereStr += "AND g.available_ticket_num = %s " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        query = "SELECT DISTINCT se.section_num " \
                "FROM tickets t " \
                "JOIN groups g ON (t.group_id = g.group_id) " \
                "JOIN sections se ON (t.section_id = se.section_id) %s" % (whereStr)
        cursor.execute(query.format(event_id, minPrice, maxPrice))
        sections = []
        for row in cursor.fetchall():
            sections.append(row[0])
        return sections

    def get_sections_by_max_price(self, event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()

        whereStr = "WHERE t.event_id = '{}' " \
                   "AND t.ticket_status_id = 1 " \
                   "AND g.ticket_price >= " \
                   "(SELECT max(ticket_price) FROM groups g WHERE g.event_id ='{}') "

        if int(desiredNumberTickets) >= 10:
            whereStr += "AND g.available_ticket_num >= 10 "
        elif int(desiredNumberTickets) is not 0:
            whereStr += "AND g.available_ticket_num = %s " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        query = "SELECT DISTINCT se.section_num " \
                "FROM tickets t " \
                "JOIN groups g ON (t.group_id = g.group_id) " \
                "JOIN sections se ON (t.section_id = se.section_id) %s" % (whereStr)

        cursor.execute(query.format(event_id, event_id))
        sections = []
        for row in cursor.fetchall():
            sections.append(row[0])
        return sections

    def get_cheapest_tickets_all_sections(self, event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()

        whereStr = "WHERE t.event_id = '{}' " \
                   "AND t.ticket_status_id = 1 " \
                   "AND ticket_price <= (SELECT min(ticket_price) FROM groups g WHERE g.event_id ='{}') "

        if int(desiredNumberTickets) >= 10:
            whereStr += "AND available_ticket_num >= 10 "
        elif int(desiredNumberTickets) is not 0:
            whereStr += "AND available_ticket_num = %s " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        query = "SELECT ticket_price, section_num, row_num, " \
                "seat_num, group_id, is_aisle_seat, is_early_entry, " \
                "is_ha, ticket_id  " \
                "FROM tickets t " \
                "JOIN groups USING (group_id) " \
                "JOIN sections USING (section_id) " \
                "JOIN rows USING (row_id) " \
                "JOIN seats USING (seat_id) %s" % (whereStr)

        cursor.execute(query.format(event_id, event_id))
        tickets = [dict(ticket_price=row[0], section_number=row[1], row_number=row[2], seat_number=row[3], group_id=row[4],
                        aisle_seat=row[5], early_access=row[6], handicap=row[7], ticket_id=row[8]) for row in cursor.fetchall()]
        return tickets

    def get_expensive_tickets_all_sections(self, event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()

        whereStr = "WHERE t.event_id = '{}' " \
                   "AND t.ticket_status_id = 1 " \
                   "AND ticket_price >= (SELECT max(ticket_price) FROM groups g WHERE g.event_id = '{}')"

        if int(desiredNumberTickets) >= 10:
            whereStr += "AND available_ticket_num >= 10 "
        elif int(desiredNumberTickets) is not 0:
            whereStr += "AND available_ticket_num = %s " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        query = "SELECT ticket_price, section_num, row_num, seat_num, group_id, " \
                "is_aisle_seat, is_early_entry, is_ha, ticket_id " \
                "FROM tickets t " \
                "JOIN groups USING (group_id) " \
                "JOIN sections USING (section_id) " \
                "JOIN rows USING (row_id) " \
                "JOIN seats USING (seat_id) %s" % (whereStr)

        cursor.execute(query.format(event_id, event_id))
        tickets = [dict(ticket_price=row[0], section_number=row[1], row_number=row[2], seat_number=row[3], group_id=row[4],
                        aisle_seat=row[5], early_access=row[6], handicap=row[7], ticket_id=row[8]) for row in cursor.fetchall()]
        return tickets

    def get_cheapest_tickets_sections(self, event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()

        whereStr = "WHERE t.event_id ='{}' " \
                   "AND t.ticket_status_id = 1 " \
                   "AND ticket_price <= (SELECT min(ticket_price) FROM groups g WHERE g.event_id = '{}') "

        if int(desiredNumberTickets) >= 10:
            whereStr += "AND available_ticket_num >= 10 "
        elif int(desiredNumberTickets) is not 0:
            whereStr += "AND available_ticket_num = %s " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        query = "SELECT DISTINCT section_num " \
                "FROM tickets t " \
                "JOIN groups USING (group_id) " \
                "JOIN sections USING (section_id) %s"  % (whereStr)

        cursor.execute(query.format(event_id, event_id))
        sections = []
        for row in cursor.fetchall():
            sections.append(row[0])
        return sections


    def get_tickets_for_selected_sections(self, event_id, section_type_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()

        whereStr = "WHERE t.event_id = '{}' AND se.section_type_id = '{}' AND t.ticket_status_id = 1 "

        if int(desiredNumberTickets) >= 10:
            whereStr += "AND g.available_ticket_num >= 10 "
        elif int(desiredNumberTickets) is not 0:
            whereStr += "AND g.available_ticket_num = %s " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        whereStr += "ORDER BY row_num"
        query = "SELECT g.ticket_price, se.section_num, r.row_num, s.seat_num, t.group_id, " \
                "t.is_aisle_seat, t.is_early_entry, t.is_ha, t.ticket_id " \
                "FROM tickets t " \
                "JOIN groups g ON (t.group_id = g.group_id) " \
                "JOIN sections se ON (t.section_id = se.section_id) " \
                "JOIN rows r ON (t.row_id = r.row_id) " \
                "JOIN seats s ON (t.seat_id = s.seat_id) %s" % (whereStr)
        cursor.execute(query.format(event_id, section_type_id))
        tickets = [dict(ticket_price=row[0], section_number=row[1],
                        row_number=row[2], seat_number=row[3],
                        group_id=row[4], aisle_seat=row[5],
                        early_access=row[6], handicap=row[7], ticket_id=row[8]) for row in
                   cursor.fetchall()]
        return tickets

    def get_seller_transactions(self, account_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        # First get transaction information (the total, total charges, transaction date)
        cursor.execute("SELECT transaction_id, transaction_dt, AVG(total_transaction_charges) AS 'Transaction Total', "
                       "SUM(amount) AS 'Total Charges', tickets_purchased_num "
                       "FROM transactions t "
                       "JOIN transaction_charges USING (transaction_id) "
                       "JOIN rates USING (rate_type_id) "
                       "WHERE t.seller_account_id={} "
                       "AND rate_type_id > 1 "
                       "GROUP BY transaction_id, rate_type_id "
                       "ORDER BY transaction_dt".format(account_id))
        transactions = [dict(transactionID=row[0], transactionDate=row[1], transactionTotal="{0:.2f}".format(row[2]), chargesTotal="{0:.2f}".format(row[3]), numTicketsSold=row[4])
                   for row in cursor.fetchall()]
        # For each transaction, get related ticket information for that transaction
        return self.read_transactions(transactions, cursor)

    def get_buyer_transactions(self, account_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        # First get transaction information (the total, total charges, transaction date)
        cursor.execute("SELECT transaction_id, transaction_dt, AVG(total_transaction_charges) AS 'Transaction Total', SUM(amount) AS 'Total Charges' "
                       "FROM transactions t "
                       "JOIN transaction_charges USING (transaction_id) "
                       "JOIN rates USING (rate_type_id) "
                       "WHERE t.buyer_account_id={} "
                       "AND rate_type_id > 1 "
                       "GROUP BY transaction_id "
                       "ORDER BY transaction_dt".format(account_id))
        transactions = [dict(transactionID=row[0], transactionDate=row[1],transactionTotal="{0:.2f}".format(row[2]),chargesTotal="{0:.2f}".format(row[3]))
                   for row in cursor.fetchall()]
        # For each transaction, get related ticket information for that transaction
        return self.read_transactions(transactions, cursor)

    def read_transactions(self, transactions, cursor):
        # For each transaction, get related ticket information for that transaction
        for transaction in transactions:
            cursor.execute("SELECT ticket_id, transaction_id, "
                        "ticket_price, g.date, section_num, row_num, seat_num, te.team_name AS 'Home Team', te2.team_name AS 'Away Team' "
                        "FROM transactions t "
                        "JOIN transaction_detail USING (transaction_id) "
                        "JOIN tickets USING (ticket_id) "
                        "JOIN games g USING (event_id) "
                        "JOIN groups USING (group_id) "
                        "JOIN sections USING (section_id) "
                        "JOIN rows USING (row_id) "
                        "JOIN seats USING (seat_id) "
                        "JOIN teams te ON (g.home_team_id = te.team_id) "
                        "JOIN teams te2 ON (g.away_team_id = te2.team_id) "
                        "WHERE transaction_id={}".format(transaction['transactionID']))
            # Using a loop here so I can compile the returned rows into more compact structure
            # Tried writing a complex SQL query to do this but was unable to do so
            seats = []
            homeTeam, awayTeam, row1, section, ticketPrice, date = "", "", "", "", "", ""
            for row in cursor.fetchall():
                ticketPrice=row[2]
                section=row[4]
                row1=row[5]
                seats.append(row[6])
                homeTeam=row[7]
                awayTeam=row[8]
                date=row[3]
            transaction['price'] = ticketPrice
            transaction['date']= date
            transaction['homeTeam'] = homeTeam
            transaction['awayTeam'] = awayTeam
            transaction['section'] = section
            transaction['row'] = row1
            transaction['seats'] = seats

        return transactions

    def get_seller_tickets(self, account_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        # Get all tickets which are still available for purchase which are being sold by this account_id
        cursor.execute("SELECT group_id, te.city, te.team_name, te2.city, te2.team_name, date, "
                       "section_type_desc, section_num, row_num, seat_num, min_sell_num, total_ticket_num, available_ticket_num, ticket_price "
                       "FROM tickets t "
                       "JOIN ticket_status USING (ticket_status_id) "
                       "JOIN groups gr USING (group_id) "
                       "JOIN sections USING (section_id) "
                       "JOIN section_type USING (section_type_id) "
                       "JOIN rows USING (row_id) "
                       "JOIN seats USING (seat_id) "
                       "JOIN games g ON g.event_id = gr.event_id "
                       "JOIN teams te ON (home_team_id = te.team_id) "
                       "JOIN teams te2 ON (away_team_id = te2.team_id) "
                       "WHERE t.account_id={} "
                       "AND ticket_status_desc='Available' "
                       "ORDER BY group_id, seat_num, row_num".format(account_id))
        # Using a loop here so I can compile the returned rows into more compact structure
        # Tried writing a complex SQL query to do this but was unable to do so
        tickets=[]
        groupNum = -1
        counter = -1
        for row in cursor.fetchall():
            if groupNum == row[0]:
                tickets[counter]['seats'].append(row[9])
            else:
                groupNum = row[0]
                counter+=1
                tickets.append({})
                tickets[counter]['groupID'] = row[0]
                tickets[counter]['homeTeam'] = row[2]
                tickets[counter]['awayTeam'] = row[4]
                tickets[counter]['date'] = row[5]
                tickets[counter]['sectionType'] = row[6]
                tickets[counter]['row'] = row[8]
                tickets[counter]['section'] = row[7]
                tickets[counter]['seats'] = [row[9]]
                tickets[counter]['minSellSize'] = row[10]
                tickets[counter]['totalTicketNum'] = row[11]
                tickets[counter]['availableTicketNum'] = row[12]
                tickets[counter]['price'] = row[13]
        return tickets

    def update_group(self, groupID, newPrice):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("UPDATE groups "
                       "SET ticket_price={} "
                       "WHERE group_id={}".format(newPrice, groupID))
        conn.commit()

    def cancel_group(self, groupID):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("UPDATE tickets "
                       "SET ticket_status_id=3 "
                       "WHERE group_id={}".format(groupID))
        conn.commit()

    def get_tickets_for_sections(self, event_id, sections, aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()
        section_string = ""
        for i in range(0, len(sections)):
            if (i == len(sections)-1):
                section_string+="'{}'".format(sections[i])
            else:
                section_string+="'{}',".format(sections[i])

        whereStr = "WHERE t.event_id = '{}' " \
                   "AND se.section_num IN ({}) " \
                   "AND t.ticket_status_id = 1 "

        if int(desiredNumberTickets) >= 10:
            whereStr += "AND g.available_ticket_num >= 10 "
        elif int(desiredNumberTickets) is not 0:
            whereStr += "AND g.available_ticket_num = %s " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        query = "SELECT g.ticket_price, se.section_num, r.row_num, s.seat_num, t.group_id, " \
                "is_aisle_seat, is_early_entry, is_ha, ticket_id  " \
                "FROM tickets t " \
                "JOIN groups g ON (t.group_id = g.group_id) " \
                "JOIN sections se ON (t.section_id = se.section_id) " \
                "JOIN rows r ON (t.row_id = r.row_id) " \
                "JOIN seats s ON (t.seat_id = s.seat_id) %s" % (whereStr)

        cursor.execute(query.format(event_id, section_string))
        tickets = [dict(ticket_price=row[0], section_number=row[1],
                        row_number=row[2], seat_number=row[3],
                        group_id=row[4], aisle_seat=row[5],
                        early_access=row[6], handicap=row[7],
                        ticket_id=row[8]) for row in cursor.fetchall()]
        return tickets

    def get_game_dates(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT g.date "
                       "FROM games g "
                       "WHERE g.date >= CURDATE()")
        data = [dict(date=row[0]) for row in cursor.fetchall()]
        return data

    def get_opponent_by_date(self, date):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT t.team_name "
                       "FROM teams t "
                       "JOIN games g ON (t.team_id = g.away_team_id) "
                       "WHERE g.date = '{}'".format(date))
        data = [dict(team_name=row[0]) for row in cursor.fetchall()]
        return data

    def get_country_names(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT c.country_id, c.country_name "
                       "FROM country c ")
        data = [dict(country_id=row[0], country_name=row[1]) for row in cursor.fetchall()]
        return data

    def get_country_states(self, country_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT s.state_prov_id, s.state_prov_name "
                       "FROM state_prov s "
                       "WHERE s.country_id = '{}'".format(country_id))
        data = [dict(state_prov_id=row[0], state_prov_name=row[1]) for row in cursor.fetchall()]
        return data

    def hold_tickets(self, account_id, ticket_ids):
        conn = self.mysql.connection
        cursor = conn.cursor()

        id_string = ""
        for i in range(0, len(ticket_ids)):
            if (i == len(ticket_ids)-1):
                id_string+="'{}'".format(ticket_ids[i])
            else:
                id_string+="'{}',".format(ticket_ids[i])


        whereStr = "WHERE ticket_id IN ({}) "
        query = "UPDATE tickets " \
                "SET ticket_status_id = 4, lock_account_id = {}, last_updated = NOW() " \
                "%s" % (whereStr)
        try:
            cursor.execute(query.format(account_id, id_string))
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False

    def purchase_tickets(self, account_id, ticket_ids):
        conn = self.mysql.connection
        cursor = conn.cursor()

        try:
            if not self.check_if_available(cursor, account_id, ticket_ids):
                return False

        except Exception as e:
            print(e)
            return False

    def set_tickets_to_purchased(self, account_id, tickets_ids):
        return ''

    def check_if_available(self, cursor, account_id, ticket_ids):
        query = "SELECT count(ticket_id) " \
                "FROM tickets " \
                "WHERE ticket_id IN ({}) " \
                "AND ticket_status_id != 4" \
                "AND lock_account_id != {}"
        cursor.execute(query.format(ticket_ids, account_id))
        if (len(cursor.fetchall()) > 0):  # If one of the tickets is not locked under the given account id, can't buy
            return False
        return True

    def get_fees(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        query = "SELECT percent FROM rates"
        cursor.execute(query)


        data = cursor.fetchall()
        percentages = []
        for i in range(0, len(data)):
            percentages.append(data[i])

        return percentages

    def create_transaction(self, buyer_id, tickets, commission, tax, subtotal, total, group_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        selectQuery = "SELECT MAX(transaction_id) FROM transactions"
        successful = True
        try:
            cursor.execute(selectQuery)
            new_id = cursor.fetchone()[0]
            if not new_id:
                new_id = 1
            else:
                new_id += 1
        except:
            return not successful
        ticket = tickets[0]['ticket_id']
        selectQuery = "SELECT account_id FROM tickets WHERE ticket_id = '{}'".format(tickets[0]['ticket_id'])
        cursor.execute(selectQuery)
        seller_id = cursor.fetchone()[0]

        insertQuery = "INSERT INTO transactions (transaction_id, seller_account_id, buyer_account_id, transaction_dt, tickets_purchased_num, total_transaction_charges)" \
                      " VALUES ('{}', '{}', '{}', NOW(), '{}', '{}')".format(new_id, seller_id, buyer_id, len(tickets), total)
        try:
            cursor.execute(insertQuery)
        except:
            return not successful

        try:
            self.create_transaction_detail(cursor, tickets, new_id, group_id)
        except:
            return not successful

        try:
            self.create_transaction_charges(cursor, new_id, commission, tax, subtotal)
        except:
            return not successful

        conn.commit()
        return successful

    def create_transaction_detail(self, cursor, tickets, transaction_id, group_id):
        for ticket in tickets:
            insertQuery = "INSERT INTO transaction_detail (transaction_id, ticket_id)" \
                          " VALUES ('{}', '{}')".format(transaction_id, ticket['ticket_id'])
            cursor.execute(insertQuery)

            id = ticket['ticket_id']
            self.set_ticket_status(cursor, id, 2)
            self.update_ticket_group_table(cursor, group_id)

    def create_transaction_charges(self, cursor, transaction_id, commission, tax, subtotal):

        selectQuery = "SELECT DISTINCT MAX(sequence_num) FROM transaction_charges"
        cursor.execute(selectQuery)
        sequence_num = cursor.fetchone()[0]

        if not sequence_num:
            sequence_num = 1
        else:
            sequence_num += 1

        amount = subtotal
        rate_type = 1
        insertQuery = "INSERT INTO transaction_charges (transaction_id, sequence_num, rate_type_id, amount)" \
                      " VALUES ('{}', '{}', '{}', '{}')".format(transaction_id, sequence_num, rate_type, amount)
        cursor.execute(insertQuery)

        amount = commission
        rate_type = 2
        insertQuery = "INSERT INTO transaction_charges (transaction_id, sequence_num, rate_type_id, amount)" \
                      " VALUES ('{}', '{}', '{}', '{}')".format(transaction_id, sequence_num, rate_type, amount)
        cursor.execute(insertQuery)

        amount = tax
        rate_type = 3
        insertQuery = "INSERT INTO transaction_charges (transaction_id, sequence_num, rate_type_id, amount)" \
                      " VALUES ('{}', '{}', '{}', '{}')".format(transaction_id, sequence_num, rate_type, amount)
        cursor.execute(insertQuery)

    def set_ticket_status(self, cursor, ticket_id, new_status):
        updateQuery = "UPDATE tickets SET ticket_status_id = '{}' WHERE ticket_id = '{}'".format(new_status, ticket_id)
        cursor.execute(updateQuery)

    def update_ticket_group_table(self, cursor, group_id):
        updateQuery = "UPDATE groups " \
                      "SET available_ticket_num =  available_ticket_num - 1 " \
                      "WHERE group_id = '{}'".format(group_id)
        cursor.execute(updateQuery)

        selectQuery = "SELECT available_ticket_num, min_sell_num " \
                    "FROM groups " \
                    "WHERE group_id = '{}'".format(group_id)
        cursor.execute(selectQuery)

        row = cursor.fetchone()
        available = row[0]
        min_sell = row[1]

        if available < min_sell:
            insertQuery = "UPDATE groups SET min_sell_num = '{}' WHERE group_id = '{}'".format(available, group_id)
            cursor.execute(insertQuery)

    def insert_ticket_listing(self, sectionNum, rowNum, seatsInfo, ticketPrice, pdfLinks, numberOfTickets, minPurchaseSize, gameDate, accountID ):
        conn = self.mysql.connection
        cursor = conn.cursor()
        ticketQueryResults = []
        successful = True

        # These are constant and already known from data passed in.
        eventIDQuery = "SELECT event_id FROM games WHERE date = '{}'".format(gameDate)

        try:
            cursor.execute(eventIDQuery)
            eventID = cursor.fetchall()
        except:
            successful = False

        sectionIDQuery = "SELECT section_id FROM sections WHERE section_num = '{}'".format(sectionNum)

        try:
            cursor.execute(sectionIDQuery)
            sectionID = cursor.fetchall
        except:
            successful = False

        rowIDQuery = "SELECT row_id FROM rows WHERE section_id = '{}' AND row_num = '{}'".format(sectionID, rowNum)

        try:
            cursor.execute(rowIDQuery)
            rowID = cursor.fetchall()
        except:
            successful = False

        groupIDQuery = ("SELECT (MAX(group_id) + 1) FROM groups")

        try:
            cursor.execute(groupIDQuery)
            groupID = cursor.fetchall()
        except:
            successful = False

        groupValues = (groupID, eventID, accountID, ticketPrice, numberOfTickets,
                       numberOfTickets, minPurchaseSize, 0.00)

        # Create a new group with the MAX(group_id) + 1 and parameters passed in
        groupQuery = "INSERT INTO groups (group_id, event_id, account_id, ticket_price, available_ticket_num, " \
                     "total_ticket_num, min_sell_num, min_profit_amount) " \
                     "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"

        try:
            cursor.execute(groupQuery, groupValues)
            groupQueryResults = cursor.fetchall()
        except:
            successful = False

        conn.commit()

        # This loops goes through the collection of seats info and adds each ticket into the database
        for i in range(0, (numberOfTickets-1)):

            seatIDQuery = "SELECT seat_id FROM seats WHERE row_id = rowID AND " \
                          "seat_num = '{}'".format(seatsInfo[i].seat[0].seat)

            try:
                cursor.execute(seatIDQuery)
                seatID = cursor.fetchall()
            except:
                successful = False

            newTicketIDQuery = "SELECT (MAX(ticket_id) + 1) FROM tickets"

            try:
                cursor.execute(newTicketIDQuery)
                newTicketID = cursor.fetchall()
            except:
                successful = False

            is_aisle_seat = 0
            if seatsInfo[i].seat[0].aisleSeat:
                is_aisle_seat = 1
            else:
                is_aisle_seat = 0

            is_early_entry = 0
            if seatsInfo[i].seat[0].earlyEntry:
                is_early_entry = 1
            else:
                is_early_entry = 0

            is_handicap_accessible = 0
            if seatsInfo[i].seat[0].handicapAccessible:
                is_handicap_accessible = 1
            else:
                is_handicap_accessible = 0

            pdfLink = pdfLinks[i]

            ticketValues = (newTicketID, groupID, accountID, 1, eventID, 1, 1, 1, is_aisle_seat, is_early_entry,
                          is_handicap_accessible, sectionID, rowID, seatID, pdfLink)

            ticketQuery = "INSERT INTO tickets (ticket_id, group_id, account_id, event_type_id, event_id," \
                          " location_id, seating_chart_id, ticket_status_id, is_aisle_seat, is_early_entry, " \
                          "is_ha, section_id, row_id, seat_id, pdf_link, lock_account_id, last_update)" \
                          "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NULL , NOW())"

            try:
                cursor.execute(ticketQuery, ticketValues)
                ticketQueryResults.append(cursor.fetchall())
            except:
                successful = False

            conn.commit()

        cursor.close()
        conn.close()

        return successful