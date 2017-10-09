from query_builder import QueryBuilder
from ticket import Ticket

class TicketBuilder:
    tickets = []

    def __init__(self, mysql):
        self.mysql = mysql
        self.queryBuilder = QueryBuilder(mysql)
        self.tickets = self.build_all_tickets()

    def build_all_tickets(self):
        ticketData = self.queryBuilder.build_select(["*"], "tickets")

        if ticketData != None:
            ticketArray = []

            for i in ticketData:
                ticketArray[i] = ticketData[i]

            return ticketArray

        else:
            return None