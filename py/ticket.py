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
    ticket.seller       = data[0]
    ticket.eventType    = data[0]
    ticket.event        = data[0]
    ticket.location     = data[0]
    ticket.seatingChart = data[0]
    ticket.price        = data[0]
    ticket.section      = data[0]
    ticket.seat         = data[0]

    return ticket



