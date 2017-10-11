class Ticket(object):
    ticketID        = -1
    seller          = -1
    eventType       = -1
    event           = -1
    location        = -1
    seatingChart    = -1
    price           = -1.0
    section         = -1
    seat            = -1

def make_ticket(data):
    ticket = Ticket()

    ticket.ticketID     = data[0]
    ticket.seller       = data[1]
    ticket.eventType    = data[2]
    ticket.event        = data[3]
    ticket.location     = data[4]
    ticket.seatingChart = data[5]
    ticket.price        = data[6]
    ticket.section      = data[7]
    ticket.seat         = data[8]

    return ticket



