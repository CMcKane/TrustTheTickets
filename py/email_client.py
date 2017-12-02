import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
import configparser

config = configparser.ConfigParser()
config.read("config.ini")
website_url = config.get('py-app-config', 'WebsiteURL')

#website_url = http://trustthetickets.com
#website_url = "http://localhost:3000"

class TTTEmailClient(object):

    def send_sale_confirmation(toAddr, event_dict, tickets, commission, tax, subtotal, total):
        msg = MIMEMultipart()
        fromAddr = 'trustthetickets@gmail.com'
        msg['From'] = fromAddr
        msg['To'] = toAddr
        msg['Subject'] = "Your ticket(s) have sold!"

        tickets_info = ''
        for ticket in tickets:
            tickets_info += "   Section: {}, Row: {}, Seats: {} \n".format(ticket['section_number'],
                                                                           ticket['row_number'],
                                                                           ticket['seat_number'])
        event_info = 'Game: ' + event_dict[0]['home_team_name'] + ' vs ' + event_dict[0]['away_team_name'] + \
            '\n' + str(event_dict[0]['date'].strftime('%B %d, %Y %I:%M%p'))
        body = \
            "You've sold {} ticket(s)! \n" \
            "{} \n\n" \
            "Tickets Sold:\n" \
            "{} \n" \
            "Subtotal: ${} \n" \
            "TTT commission: ${} \n" \
            "Tax: ${} \n" \
            "Total: ${} \n\n" \
            "Thank you for shopping at Trust The Tickets!"\
                .format(len(tickets), event_info, tickets_info, subtotal, commission, tax, total)
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(fromAddr, 'seniorproject2017')
        text = msg.as_string()
        server.sendmail(fromAddr, toAddr, text)
        server.quit()

    def send_confirmation(toAddr, registrationID):
        msg = MIMEMultipart()
        fromAddr = 'trustthetickets@gmail.com'
        msg['From'] = fromAddr
        msg['To'] = toAddr
        msg['Subject'] = "Complete Your Registration at TrustTheTickets!"

        body = "Use the following link to complete your registration: \n " + \
               website_url + "/register/?registrationID=" + registrationID
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(fromAddr, 'seniorproject2017')
        text = msg.as_string()
        server.sendmail(fromAddr, toAddr, text)
        server.quit()

    def send_combined_ticket_file(toAddr, file, filename):
        msg = MIMEMultipart()
        fromAddr = 'trustthetickets@gmail.com'
        msg['From'] = fromAddr
        msg['To'] = toAddr
        msg['Subject'] = "Your Purchase at TrustTheTickets!"

        body = "Thank you for your recent purchase from TrustTheTickets! \n " + \
               "Attached please find a pdf file containing your tickets. \n " + \
                "Enjoy the game, and Go Philly!"
        msg.attach(MIMEText(body, 'plain'))

        part = MIMEApplication(file.read())
        part['Content-Disposition'] = 'attachement; filename="%s"' % filename
        msg.attach(part)

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(fromAddr, 'seniorproject2017')
        text = msg.as_string()
        server.sendmail(fromAddr, toAddr, text)
        server.quit()
