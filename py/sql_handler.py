from passlib.hash import sha256_crypt

### This is the SQL handler class which is responsible for making calls to the database.
### The code here is for writing and retrieving from different tables in the schema.
class SqlHandler(object):

    # Initialization method for SQL handler.
    def __init__(self, mysql):
        self.mysql = mysql

    # Retrieves the first and last name of a user with the
    # given account ID.
    # param IN self - this class object
    # param IN account_id - the account id to retrive the data for.
    # param OUT a dictionary object containing valid authentication, first and last name.
    def get_account_info(self, account_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT first_name, last_name "
                       "FROM accounts "
                       "WHERE account_id = '{}'".format(account_id))
        cols = cursor.fetchone()
        account_info = dict(authenticated=True, firstName=cols[0], lastName=cols[1])
        return account_info

    # Gets all of the accounts located in the accoutns table.
    # param IN mysql - an sql object.
    # param OUT array of dictionaries containing account data.
    def get_accounts(mysql):
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT account_id, email, created_dt, first_name, last_name FROM accounts")
        accounts = [dict(account_id=row[0], email=row[1], created_dt=row[2], fname=row[3], lname=row[4]) for row in
                    cursor.fetchall()]
        return accounts

    # Checks to see if the passed email exists already.
    # param IN self - this class object.
    # param IN email - the email to check for.
    def check_for_email(self, email):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT account_id FROM accounts WHERE email = '{}'".format(email))
        return len(cursor.fetchall())

    # Retrieves an account to use in the registation confirmation.
    # param IN self - this class object.
    # param IN registrationID - the registration code to use in the WHERE clause.
    # param OUT True if written False if not.
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

    # Gets data for games in the date range.
    # param IN self - this class object.
    # param IN start_date - the starting date bound.
    # param IN end_date - the ending date bound.
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

    # Retrieves event data for the passed event ID.
    # param IN self - this class object.
    # param IN event_id - the event id.
    def get_event(self, event_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        try:
            cursor.execute(
                "SELECT concat(a.team_name,' vs ', h.team_name) AS Title, "
                "h.team_name, "
                "a.team_name, "
                "date, "
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
                                 homeTeam=cols[1], awayTeam=cols[2],
                                 date=cols[3], numTickets=cols[4],
                                 minPrice=cols[5])
            return event_details
        except Exception as e:
            print(e)

    # Inserts an account row into the database during registration.
    # param IN self - this class object
    # param IN account - the account to have its data written to the database.
    # param IN registrationID - the registration ID.
    # param OUT True if authenticated False if not.
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
            'INSERT INTO accounts (account_id, email, password, account_status_id, created_dt, first_name, last_name, address, city, state_prov_id, zip, country_id, phone1 ) VALUES ("{}","{}","{}","{}", NOW(),"{}","{}","{}","{}","{}","{}","{}","{}")'
                .format(newAccountID, account.email, hashedPass, 2, account.firstName, account.lastName,
                        account.address, account.city, account.stateprovid, account.zipCode, account.countryid,
                        account.phoneNumber))
        cursor.execute(
            "INSERT INTO account_registration (account_id, registration_code) VALUES ('{}','{}')"
                .format(newAccountID, registrationID))
        conn.commit()

    # Verifies that the email and password are valid.
    # param IN self - this class object.
    # param IN email - the email
    # param IN password - the password
    # param OUT a dictionary of account data False if failure.
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

    # Get the teams playing in all of the games.
    # param IN self - this class object.
    # param OUT an array of dictionaries containing the home team and away team name and cities of each.
    def get_teams_for_games(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.callproc("get_teams_for_games")
        data = [dict(home_team=row[0], home_city=row[1], away_team=row[2], away_city=row[3]) for row in
                cursor.fetchall()]
        return data

    # Gets games for a specific team.
    # param IN self - this class object.
    # param IN team_id - the team id to find the games for.
    # param OUT array of dictionaries containing game data for the team.
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

    # Gets the event information for a specific event id.
    # param IN self - this class object.
    # param IN event_id - the event id.
    # param OUT a dictionary of event data.
    def get_event_info(self, event_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT g.date, "
                       "home.team_name, away.team_name "
                       "FROM games g "
                       "JOIN teams home ON (g.home_team_id = home.team_id) "
                       "JOIN teams away ON (g.away_team_id = away.team_id) "
                       "WHERE g.event_id = '{}'".format(event_id))
        data = [dict(date=row[0], home_team_name=row[1], away_team_name=row[2]) for row in cursor.fetchall()]
        return data

    # Gets all of the teams in the database.
    # param IN self - this class object.
    # param OUT an array of dictionaries containing each team data.
    def get_all_teams(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        # by specifying team_id != 23, we are excluding the 76ers from this query
        cursor.execute("SELECT team_id, city, team_name FROM teams WHERE sport_type_id = 1 AND team_id != 23")
        data = [dict(team_id=row[0], city=row[1], team_name=row[2]) for row in cursor.fetchall()]
        return data

    # searches for all tickets that meet the filter requirements in the provided sections
    def get_tickets_in_sections_with_filter(self, event_id, sections, minPrice, maxPrice,
                                            aisleSeat, earlyAccess, handicap, desiredNumberTickets):
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
                   "AND g.ticket_price >= '{}' " \
                   "AND g.ticket_price <= '{}' " \
                   "AND t.ticket_status_id = 1 "

        if int(desiredNumberTickets) is not 0:
            whereStr += "AND %s <= (SELECT count(ti.ticket_id) FROM tickets ti JOIN groups USING(group_id) WHERE ti.ticket_status_id = 1 AND ti.group_id = t.group_id) " % (desiredNumberTickets)
            whereStr += "AND %s >= g.min_sell_num " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        query = "SELECT g.ticket_price, se.section_num, r.row_num, s.seat_num, t.group_id, " \
                "is_aisle_seat, is_early_entry, is_ha, ticket_id, min_sell_num " \
                "FROM tickets t " \
                "JOIN groups g ON (t.group_id = g.group_id) " \
                "JOIN sections se ON (t.section_id = se.section_id) " \
                "JOIN rows r ON (t.row_id = r.row_id) " \
                "JOIN seats s ON (t.seat_id = s.seat_id) %s" % (whereStr)

        cursor.execute(query.format(event_id, section_string, minPrice, maxPrice))
        tickets = [dict(ticket_price=row[0], section_number=row[1],
                        row_number=row[2], seat_number=row[3],
                        group_id=row[4], aisle_seat=row[5],
                        early_access=row[6], handicap=row[7],
                        ticket_id=row[8], min_sell_num=row[9]) for row in cursor.fetchall()]
        return tickets

    # searches for all tickets that meet the filter requirements in any section
    def get_tickets_with_filter_all_sections(self, minPrice, maxPrice, event_id,
                                             aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()

        whereStr = "WHERE g.ticket_price >= '{}' " \
                   "AND g.ticket_price <= '{}' " \
                   "AND t.event_id = '{}' " \
                   "AND t.ticket_status_id = 1 " \

        if int(desiredNumberTickets) is not 0:
            whereStr += "AND %s <= (SELECT count(ti.ticket_id) FROM tickets ti JOIN groups USING(group_id) WHERE ti.ticket_status_id = 1 AND ti.group_id = t.group_id) " % (desiredNumberTickets)
            whereStr += "AND %s >= g.min_sell_num " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        query = "SELECT  g.ticket_price, se.section_num, r.row_num, s.seat_num, t.group_id, t.ticket_id,  " \
                "t.is_early_entry, t.is_aisle_seat, t.is_ha, g.min_sell_num " \
                "FROM tickets t " \
                "JOIN groups g ON (t.group_id = g.group_id) " \
                "JOIN sections se ON (t.section_id = se.section_id) " \
                "JOIN rows r ON (t.row_id = r.row_id) " \
                "JOIN seats s ON (t.seat_id = s.seat_id) %s" % (whereStr)

        cursor.execute(query.format(minPrice, maxPrice, event_id))
        tickets = [dict(ticket_price=row[0], section_number=row[1],
                        row_number=row[2], seat_number=row[3],
                        group_id=row[4], ticket_id=row[5],
                        early_access=row[6], aisle_seat=row[7], handicap=row[8], min_sell_num=row[9]) for row in cursor.fetchall()]
        return tickets

    # gets tickets by the section type, while applying the filter
    def get_tickets_in_section_type_with_filter(self, event_id, section_type_id, minPrice, maxPrice,
                                                aisleSeat, earlyAccess, handicap, desiredNumberTickets):
        conn = self.mysql.connection
        cursor = conn.cursor()

        whereStr = "WHERE t.event_id = '{}' " \
                   "AND se.section_type_id = '{}' " \
                   "AND g.ticket_price >= '{}' " \
                   "AND g.ticket_price <= '{}' " \
                   "AND t.ticket_status_id = 1 "

        if int(desiredNumberTickets) is not 0:
            whereStr += "AND %s <= (SELECT count(ti.ticket_id) " \
                        "FROM tickets ti " \
                        "JOIN groups USING(group_id) " \
                        "WHERE ti.ticket_status_id = 1 AND ti.group_id = t.group_id) " % (desiredNumberTickets)
            whereStr += "AND %s >= g.min_sell_num " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        whereStr += "ORDER BY row_num"
        query = "SELECT g.ticket_price, se.section_num, r.row_num, s.seat_num, t.group_id, " \
                "t.is_aisle_seat, t.is_early_entry, t.is_ha, t.ticket_id, g.min_sell_num " \
                "FROM tickets t " \
                "JOIN groups g ON (t.group_id = g.group_id) " \
                "JOIN sections se ON (t.section_id = se.section_id) " \
                "JOIN rows r ON (t.row_id = r.row_id) " \
                "JOIN seats s ON (t.seat_id = s.seat_id) %s" % (whereStr)
        cursor.execute(query.format(event_id, section_type_id, minPrice, maxPrice))
        tickets = [dict(ticket_price=row[0], section_number=row[1],
                        row_number=row[2], seat_number=row[3],
                        group_id=row[4], aisle_seat=row[5],
                        early_access=row[6], handicap=row[7], ticket_id=row[8], min_sell_num=row[9]) for row in
                   cursor.fetchall()]
        return tickets

    def get_tickets_by_price(self, event_id, aisleSeat, earlyAccess, handicap,
                             desiredNumberTickets, priceMode, minPrice, maxPrice):
        if priceMode == 1:
            return SqlHandler.get_cheap_ticket_any_section(self, event_id, minPrice, maxPrice, aisleSeat, earlyAccess, handicap, desiredNumberTickets)
        elif priceMode == 2 or priceMode == 3:
            return SqlHandler.get_extrema_tickets_all_sections(self, event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets, priceMode)
        elif priceMode == 4:
            print("four")
        return None


    # used for fetching sections and tickets based on the highest or lowest price listed for a particular event
    # lowest or highest price is determined by the value of priceMode
    # if 2, then "lowest"
    # if 3, then "highest"
    def get_extrema_tickets_all_sections(self, event_id, aisleSeat, earlyAccess, handicap, desiredNumberTickets, priceMode):
        conn = self.mysql.connection
        cursor = conn.cursor()

        priceClause = ""
        if priceMode == 2:
            priceClause = "<= (SELECT MIN(ticket_price)"
        elif priceMode == 3:
            priceClause = ">= (SELECT MAX(ticket_price)"

        whereStr = "WHERE t.event_id = '{}' " \
                   "AND t.ticket_status_id = 1 " \
                   "AND ticket_price %s " \
                   "FROM groups g WHERE g.event_id ='{}' and g.available_ticket_num > 0) " % priceClause

        if int(desiredNumberTickets) is not 0:
            whereStr += "AND %s <= (SELECT count(ti.ticket_id) " \
                        "FROM tickets ti JOIN groups USING(group_id) " \
                        "WHERE ti.ticket_status_id = 1 AND ti.group_id = t.group_id) " % (desiredNumberTickets)
            whereStr += "AND %s >= min_sell_num " % (desiredNumberTickets)

        if aisleSeat is 1:
            whereStr += "AND t.is_aisle_seat = 1 "
        if earlyAccess is 1:
            whereStr += "AND t.is_early_entry = 1 "
        if handicap is 1:
            whereStr += "AND t.is_ha = 1 "

        query = "SELECT ticket_price, section_num, row_num, " \
                "seat_num, group_id, is_aisle_seat, is_early_entry, " \
                "is_ha, ticket_id, min_sell_num " \
                "FROM tickets t " \
                "JOIN groups USING (group_id) " \
                "JOIN sections USING (section_id) " \
                "JOIN rows USING (row_id) " \
                "JOIN seats USING (seat_id) %s" % (whereStr)

        cursor.execute(query.format(event_id, event_id))
        tickets = [dict(ticket_price=row[0], section_number=row[1], row_number=row[2], seat_number=row[3], group_id=row[4],
                        aisle_seat=row[5], early_access=row[6], handicap=row[7], ticket_id=row[8], min_sell_num=row[9]) for row in cursor.fetchall()]
        return tickets

    # Gets all of the seller transactions for an account id.
    # param IN self - this class object.
    # param IN account_id - the seller account id.
    # param OUT an array of dictionaries containg the transaction data.
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
                       "GROUP BY transaction_id "
                       "ORDER BY transaction_dt".format(account_id))
        transactions = [dict(transactionID=row[0], transactionDate=row[1], transactionTotal="{0:.2f}".format(row[2]), chargesTotal="{0:.2f}".format(row[3]), numTicketsSold=row[4])
                   for row in cursor.fetchall()]
        # For each transaction, get related ticket information for that transaction
        return self.read_transactions(transactions, cursor)

    # Gets the buyer transactions for the account id.
    # param IN self - this class object.
    # param IN account_id - the account id
    # param OUT an array of dictionaries containing the transaction data.
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

    # Retrieves the transaction data.
    # param IN self - this class object.
    # param IN transactions - the transactions
    # param IN cursor - the cursor to execute the query.
    # param OUT the transaction data.
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

    # Get the tickets listed by a seller.
    # param IN self - this class object.
    # param IN account_id - the account id of the seller.
    # param OUT the ticket data.
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
                       "ORDER BY group_id, (CAST(seat_num AS UNSIGNED)), row_num".format(account_id))
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

    # Gets a group data for a group id.
    # param IN self - this class object.
    # param IN groupID - the group id to search on.
    # param OUT the group data.
    def get_group(self, groupID):
        conn = self.mysql.connection
        cursor = conn.cursor()
        query = "SELECT ticket_price, section_num, row_num, " \
                "seat_num, group_id, is_aisle_seat, is_early_entry, " \
                "is_ha, ticket_id, min_sell_num " \
                "FROM tickets t " \
                "JOIN groups USING (group_id) " \
                "JOIN sections USING (section_id) " \
                "JOIN rows USING (row_id) " \
                "JOIN seats USING (seat_id) " \
                "WHERE group_id = '{}'"

        cursor.execute(query.format(groupID))
        tickets = [
            dict(ticket_price=row[0], section_number=row[1], row_number=row[2], seat_number=row[3], group_id=row[4],
                 aisle_seat=row[5], early_access=row[6], handicap=row[7], ticket_id=row[8], min_sell_num=row[9]) for row
            in cursor.fetchall()]
        return tickets

    # Updates the ticket price for a specific group ID.
    # param IN self - this class object.
    # param IN groupID - the group id.
    # param IN newPrice - the price to update with.
    def update_group(self, groupID, newPrice):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("UPDATE groups "
                       "SET ticket_price={} "
                       "WHERE group_id={}".format(newPrice, groupID))
        conn.commit()

    # Changes the status of a ticket in a group.
    # param IN self - this class object.
    # param IN groupID - the group id.
    def cancel_group(self, groupID):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("UPDATE tickets "
                       "SET ticket_status_id = 3, available_ticket_num = 0 "
                       "WHERE group_id={}".format(groupID))
        conn.commit()

    # Gets the dates for a game.
    # param IN self - this class object.
    # param OUT returns the date.
    def get_game_dates(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT g.date "
                       "FROM games g "
                       "WHERE g.date >= CURDATE()")
        data = [dict(date=row[0]) for row in cursor.fetchall()]
        return data

    # Gets the opponent of team on a specific date.
    # param IN self - this class object.
    # param IN date - the date.
    # param OUT the opponent team data.
    def get_opponent_by_date(self, date):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT t.team_name "
                       "FROM teams t "
                       "JOIN games g ON (t.team_id = g.away_team_id) "
                       "WHERE g.date = '{}'".format(date))
        data = [dict(team_name=row[0]) for row in cursor.fetchall()]
        return data

    # Gets all of the country names.
    # param IN self - this class object.
    # param OUT the country data.
    def get_country_names(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT c.country_id, c.country_name "
                       "FROM country c ")
        data = [dict(country_id=row[0], country_name=row[1]) for row in cursor.fetchall()]
        return data

    # Gets the state province data for a country id.
    # param IN self - this class object.
    # param IN country_id - the country id.
    # param OUT the state province data.
    def get_country_states(self, country_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT s.state_prov_id, s.state_prov_name "
                       "FROM state_prov s "
                       "WHERE s.country_id = '{}'".format(country_id))
        data = [dict(state_prov_id=row[0], state_prov_name=row[1]) for row in cursor.fetchall()]
        return data

    # Sets the ticket status to the hold state.
    # param IN self - this class object.
    # param IN account_id - the account id.
    # param IN ticket_ids - the ticket ids to change the state of.
    # param OUT True if successful False if not.
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

    # Changes the ticket status to available.
    # param IN self - this class object.
    # param IN ticket_ids - the ticket ids.
    # param OUT True if successful False if not.
    def unlock_tickets(self, ticket_ids):
        conn = self.mysql.connection
        cursor = conn.cursor()

        id_string = ""
        for i in range(0, len(ticket_ids)):
            if (i == len(ticket_ids)-1):
                id_string+="'{}'".format(ticket_ids[i])
            else:
                id_string+="'{}',".format(ticket_ids[i])


        whereStr = "WHERE ticket_id IN ({}) AND lock_account_id IS NOT NULL "
        query = "UPDATE tickets " \
                "SET ticket_status_id = 1, lock_account_id = NULL " \
                "%s" % (whereStr)
        try:
            cursor.execute(query.format(id_string))
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False

    # Purchases tickets.
    def purchase_tickets(self, account_id, ticket_ids):
        conn = self.mysql.connection
        cursor = conn.cursor()

        try:
            if not self.check_if_available(cursor, account_id, ticket_ids):
                return False

        except Exception as e:
            print(e)
            return False

    # Deprecate
    def set_tickets_to_purchased(self, account_id, tickets_ids):
        return ''

    # Checks to see if a ticket status is available for a ticket id.
    # param IN self - this class object.
    # param IN cursor - the cursor to execute.
    # param IN account_id - the account id.
    # param IN ticket_ids - the ticket ids to check.
    # param OUT True if they are available False if not.
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

    # Retrieves all the transaction fees.
    # param IN self - this class object.
    # param OUT the fee data.
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

    # Creates a new transaction.
    # param IN self - this class object.
    # param IN buyer_id - the buyer account id.
    # param IN tickets - the tickets in the transaction.
    # param IN commission - unused.
    # param IN tax - unused
    # param IN subtotal - unused.
    # param IN total - the total price.
    # param IN group_id - the group id.
    # param IN tax_per_ticket - individual ticket tax.
    # param IN comm_per_ticket - the commission made on each ticket.
    # param IN subtotal_per_ticket - the subtotal for each ticket.
    # param OUT True if successful False if not.
    def create_transaction(self, buyer_id, tickets, commission, tax, subtotal, total, group_id,
                           tax_per_ticket, comm_per_ticket, subtotal_per_ticket):
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
            self.create_transaction_detail(conn, cursor, tickets, new_id, group_id)
        except:
            return not successful

        try:
            self.create_transaction_charges(cursor, new_id, tax_per_ticket, comm_per_ticket, subtotal_per_ticket, tickets)
            conn.commit()
        except:
            return not successful

        conn.commit()
        return successful

    # Creates the transaction details.
    # param IN self - this class object.
    # param IN conn - the connection object.
    # param IN cursor - the cursor to execute.
    # param IN tickets - the tickets in the transaction.
    # param IN transaction_id - the transaction id.
    # param IN group_id - the ticket group id.
    def create_transaction_detail(self, conn, cursor, tickets, transaction_id, group_id):
        for ticket in tickets:
            insertQuery = "INSERT INTO transaction_detail (transaction_id, ticket_id)" \
                          " VALUES ('{}', '{}')".format(transaction_id, ticket['ticket_id'])
            cursor.execute(insertQuery)

            id = ticket['ticket_id']
            self.set_ticket_status(conn, cursor, id, 2)
            self.update_ticket_group_table(conn, cursor, group_id)

    # Creates the charges for the transaction.
    # param IN self - this class object.
    # param IN cursor - the cursor to execute.
    # param IN transaction_id - the transaction id.
    # param IN tax_per_ticket - the tax per each ticket in the transaction.
    # param IN comm_per_ticket - the commision for each ticket.
    # param IN subtotal_per_ticket - the subtotal for each ticket.
    # param IN tickets - the tickets in the transaction.
    def create_transaction_charges(self, cursor, transaction_id, tax_per_ticket, comm_per_ticket, subtotal_per_ticket, tickets):

        sequence_num = 0
        for i in range(0, len(tickets)):

            sequence_num = sequence_num + 1

            amount = subtotal_per_ticket[i]
            rate_type = 1
            insertQuery = "INSERT INTO transaction_charges (transaction_id, sequence_num, rate_type_id, amount)" \
                          " VALUES ('{}', '{}', '{}', '{}')".format(transaction_id, sequence_num, rate_type, amount)
            cursor.execute(insertQuery)

            amount = comm_per_ticket[i]
            rate_type = 2
            insertQuery = "INSERT INTO transaction_charges (transaction_id, sequence_num, rate_type_id, amount)" \
                          " VALUES ('{}', '{}', '{}', '{}')".format(transaction_id, sequence_num, rate_type, amount)
            cursor.execute(insertQuery)

            amount = tax_per_ticket[i]
            rate_type = 3
            insertQuery = "INSERT INTO transaction_charges (transaction_id, sequence_num, rate_type_id, amount)" \
                          " VALUES ('{}', '{}', '{}', '{}')".format(transaction_id, sequence_num, rate_type, amount)
            cursor.execute(insertQuery)

    # Sets the ticket status to the desired parameter status.
    # param IN self - this class object.
    # param IN conn - the connection object.
    # param IN cursor - the cursor to execute.
    # param IN ticket_id - the ticket id.
    # param IN new_status - the status to set the ticket to.
    def set_ticket_status(self, conn, cursor, ticket_id, new_status):
        updateQuery = "UPDATE tickets SET ticket_status_id = '{}', lock_account_id = NULL " \
                      "WHERE ticket_id = '{}'".format(new_status, ticket_id)
        cursor.execute(updateQuery)
        conn.commit()

    # Updates the ticket group table with the minimum sell amount.
    # param IN self - this class object.
    # param IN conn - the connection object.
    # param IN cursor - the cursor to execute.
    # param IN group_id - the group id.
    def update_ticket_group_table(self, conn, cursor, group_id):
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

        conn.commit()

    # Gets the email for the passed account id.
    # param IN self - this class object.
    # param IN accountId - the account id to search on.
    # param OUT the email data.
    def get_user_email(self, accountId):
        conn = self.mysql.connection
        cursor = conn.cursor()
        getUserEmailQuery = ("SELECT email FROM accounts WHERE account_id = '{}'").format(accountId)
        cursor.execute(getUserEmailQuery)
        email = cursor.fetchone()[0]
        return email

    # Get the email and phone of a seller.
    # param IN self - this class object.
    # param IN group_id - the group id to search on.
    # param OUT the phone number and email.
    def get_seller_email_and_phone(self, group_id):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT phone1, email FROM groups "
         "JOIN accounts USING (account_id) "
         "WHERE group_id = '{}'".format(group_id))
        res = cursor.fetchone()
        phone_num = res[0]
        email = res[1]
        return phone_num, email

    # Insert a ticket listing.
    # param IN self - this class object.
    # param IN sectionNum - the section number.
    # param IN rowNum - the row number.
    # param IN seatsInfo - the seat information.
    # param IN ticketPrice - the ticket price.
    # param IN numberOfTickets - the number of tickets in the listing.
    # param IN minPurchaseSize - the minimum number of tickets capable of being sold in a single transaction.
    # param IN gameDAta - the game data.
    # param IN accountID - the account ID making the listing.
    # param OUT True if successful False if not.
    def insert_ticket_listing(self, sectionNum, rowNum, seatsInfo, ticketPrice, numberOfTickets, minPurchaseSize, gameDate, accountID):
        conn = self.mysql.connection
        cursor = conn.cursor()
        ticketQueryResults = []
        successful = True

        # These are constant and already known from data passed in.
        eventIDQuery = "SELECT event_id FROM games WHERE date = '{}'".format(gameDate)

        try:
            cursor.execute(eventIDQuery)
            eventID = cursor.fetchone()[0]
        except:
            successful = False
            print("failed at line 743")

        sectionIDQuery = "SELECT section_id FROM sections WHERE section_num = '{}'".format(sectionNum)

        try:
            cursor.execute(sectionIDQuery)
            sectionID = cursor.fetchone()[0]
        except:
            successful = False
            print("failed at line 752")

        rowIDQuery = "SELECT row_id FROM rows WHERE section_id = '{}' AND row_num = '{}'".format(sectionID, rowNum)

        try:
            cursor.execute(rowIDQuery)
            rowID = cursor.fetchone()[0]
        except:
            successful = False
            print("failed at line 761")

        groupIDQuery = ("SELECT (MAX(group_id) + 1) FROM groups")

        try:
            cursor.execute(groupIDQuery)
            groupID = cursor.fetchone()[0]
        except:
            successful = False
            print("failed at line 770")

        groupValues = (groupID, eventID, accountID, ticketPrice, numberOfTickets,
                       numberOfTickets, minPurchaseSize, 0.00)

        # Create a new group with the MAX(group_id) + 1 and parameters passed in
        groupQuery = "INSERT INTO groups (group_id, event_id, account_id, ticket_price, available_ticket_num, " \
                     "total_ticket_num, min_sell_num, min_profit_amount) " \
                     "VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')"

        try:
            cursor.execute(groupQuery.format(groupID, eventID, accountID, ticketPrice, numberOfTickets, numberOfTickets, minPurchaseSize, 0.00))
        except:
            successful = False
            print("failed at line 784")

        conn.commit()

        returnTicketIds = [None]*int(numberOfTickets)

        # This loops goes through the collection of seats info and adds each ticket into the database
        for i in range(0, (int(numberOfTickets))):

            seatIDQuery = "SELECT seat_id FROM seats WHERE row_id = '{}' AND " \
                          "seat_num = '{}'".format(rowID, seatsInfo[i]['seat'][0]['seatNum'])

            try:
                cursor.execute(seatIDQuery)
                seatID = cursor.fetchone()[0]
            except:
                successful = False
                print("failed at line 801")

            newTicketIDQuery = "SELECT (MAX(ticket_id) + 1) FROM tickets"

            try:
                cursor.execute(newTicketIDQuery)
                newTicketID = cursor.fetchone()[0]
                returnTicketIds[i] = newTicketID
            except:
                successful = False
                print("failed at line 811")

            is_aisle_seat = 0
            if seatsInfo[i]['seat'][0]['aisleSeat']:
                is_aisle_seat = 1
            else:
                is_aisle_seat = 0

            is_early_entry = 0
            if seatsInfo[i]['seat'][0]['earlyEntry']:
                is_early_entry = 1
            else:
                is_early_entry = 0

            is_handicap_accessible = 0
            if seatsInfo[i]['seat'][0]['handicapAccessible']:
                is_handicap_accessible = 1
            else:
                is_handicap_accessible = 0

            ticketQuery = "INSERT INTO tickets (ticket_id, group_id, account_id, event_type_id, event_id," \
                          " location_id, seating_chart_id, ticket_status_id, is_aisle_seat, is_early_entry, " \
                          "is_ha, section_id, row_id, seat_id, pdf_link, lock_account_id, last_updated) " \
                          "VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', NULL, NULL , NOW())"

            try:
                cursor.execute(ticketQuery.format(newTicketID, groupID, accountID, 1,
                                                  eventID, 1, 1, 1, is_aisle_seat, is_early_entry,
                                                  is_handicap_accessible, sectionID, rowID, seatID))
            except:
                succesful = False
                print("failed at line 842")

            conn.commit()

            if not successful:
                returnTicketIds = None

        return returnTicketIds

    # Validates that the ticket information is valid and capable of being placed
    # into the database.
    # param IN self - this class object.
    # param IN sectionNum - the section number.
    # param IN rowNum - the row number.
    # param IN seatsInfo - the seat information.
    # param IN gameDate - the game date.
    def validate_ticket_info(self, sectionNum, rowNum, seatsInfo, gameDate):

        conn = self.mysql.connection
        cursor = conn.cursor()

        # by default assume everything is invalid unless we get positive feedback from db
        sectionNumIsValid = False
        rowNumIsValid = False
        aSeatNumIsInvalid = False

        # declare seats validity results list
        seatsValidity = []

        # validate section number first by querying the db for a row in the sections table
        # with a section number equal to the one provided by the user
        sectionQuery = "SELECT COUNT(section_id) AS res_cnt, section_id FROM sections WHERE section_num = '{}' GROUP BY section_id".format(sectionNum)
        try:
            cursor.execute(sectionQuery)
            row = cursor.fetchone()
            resultCount = row[0]
            sectionId = row[1]
            sectionNumIsValid = (resultCount == 1)
        except Exception as e:
            print(e)
            print("failed at line 875")

        if sectionNumIsValid:

            # since the section num is valid, we can search for
            # a corresponding row that might exist in that section.
            rowQuery = "SELECT COUNT(row_id) AS res_cnt, row_id FROM rows " \
                       "WHERE section_id = '{}' and row_num = '{}' GROUP BY row_id".format(sectionId, rowNum)
            try:
                cursor.execute(rowQuery)
                row = cursor.fetchone()
                resultCount = row[0]
                rowId = row[1]
                rowNumIsValid = (resultCount == 1)
            except:
                print("failed at line 890")

            if rowNumIsValid:
                # since the row number is correct as well,
                # we can validate the seat numbers for that row
                seatQuery = "SELECT MAX(CAST(seat_num AS UNSIGNED)) AS max_seat_num, " \
                            "MIN(seat_id) as min_seat_id FROM seats " \
                            "WHERE row_id = '{}'".format(rowId)
                try:
                    cursor.execute(seatQuery)
                    row = cursor.fetchone()
                    maxSeatNum = row[0]
                    minSeatId = row[1]
                except:
                    print("failed at line 904")

                # now lets test all of the seat numbers
                # to make sure that they are in between the available range

                for s in seatsInfo:
                    curSeatNum = int(s['seat'][0]['seatNum'])
                    curSeatValid = (1 <=  curSeatNum and curSeatNum <= maxSeatNum)
                    seatsValidity.append(dict(seatNum=s['seat'][0]['seatNum'], seatNumValid=curSeatValid))
                    if not curSeatValid:
                        aSeatNumIsInvalid = True

            else:
                print("Row is invalid!")
                print("Therefore therefore all seats are invalid as well!")

        else:
            print("Section is invalid!")
            print("Therefore Row is invalid as well!")
            print("Therefore therefore all seats are invalid as well!")

        # since section or row is invalid, seats are invalid as well
        if not sectionNumIsValid or not rowNumIsValid:
            seatsValidity = [(dict(seatNum=s['seat'][0]['seatNum'], seatNumValid=False)) for s in seatsInfo]
            aSeatNumIsInvalid = True

        locationResults = dict(sectionNumValid=sectionNumIsValid, rowNumValid=rowNumIsValid, seatsValidity=seatsValidity)

        ticketListedResults = [];

        # ============================================================================================
        # now lets check to see if any tickets are already listed for the same seats for the same game
        # to proceed we must have all correct ticket location information at this point
        if not aSeatNumIsInvalid:
            eventIDQuery = "SELECT event_id FROM games WHERE date = '{}'".format(gameDate)
            try:
                cursor.execute(eventIDQuery)
                eventId = cursor.fetchone()[0]
            except:
                print("failed on line 943")

            duplicateTicketsQuery = "SELECT seat_id FROM tickets where event_id = '{}' and row_id = '{}' and ticket_status_id = 1".format(eventId, rowId)

            try:
                cursor.execute(duplicateTicketsQuery)
                listedTicketSeatIds = cursor.fetchall()
                for sid in listedTicketSeatIds:
                    for s in seatsInfo:
                        curSeatNum = int(s['seat'][0]['seatNum'])
                        curSeatNumToId = curSeatNum + minSeatId - 1
                        if curSeatNumToId == int(sid[0]):
                            print("duplicate ticket listing for seat num " + str(curSeatNum))
                            ticketListedResults.append(dict(seatNum=curSeatNum, seatAlreadyListed=True))
            except:
                print("failed on line 958")

        return dict(locationResults=locationResults, ticketListedResults=ticketListedResults)