import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
import configparser

config = configparser.ConfigParser()
config.read("config.ini")
website_url = config.get('py-app-config', 'WebsiteURL')

class TTTEmailClient(object):

    def send_sale_confirmation(toAddr, event_dict, tickets, commission, tax, subtotal, total):
        msg = MIMEMultipart()
        fromAddr = 'trustthetickets@gmail.com'
        msg['From'] = fromAddr
        msg['To'] = toAddr
        msg['Subject'] = "Your ticket(s) have sold!"

        tickets_info = ''
        for ticket in tickets:
            tickets_info += "   Section #: {}, Row #: {}, Seat #: {} \n".format(ticket['section_number'],
                                                                           ticket['row_number'],
                                                                           ticket['seat_number'])
        event_info = event_dict[0]['home_team_name'] + ' vs ' + event_dict[0]['away_team_name'] + \
            '\n' + str(event_dict[0]['date'].strftime('%B %d, %Y %I:%M%p'))
        body = \
            "Congratulations, \n" \
            "We're pleased to inform you that one of your listings has sold {} of its tickets! \n" \
            "Game Information: \n" \
            "{} \n" \
            "Tickets Sold:\n" \
            "{} \n" \
            "Your Payout Total: ${} \n" \
            "Thank you for listing on Trust The Tickets, Philadelphia's fan-centric ticket marketplace!"\
                .format(len(tickets), event_info, tickets_info, subtotal)
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

        body = "Thank you for your recent account creation on TrustTheTickets.com!\n" \
               "In order to activate your account you must verify this email address.\n" \
               "Use the following link to complete your registration and verify your email:\n\n" + \
               website_url + "/register/?registrationID=" + registrationID + "\n\n" \
                "Sincerely,\n\n" \
                "The Folks @ TrustTheTickets"
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
