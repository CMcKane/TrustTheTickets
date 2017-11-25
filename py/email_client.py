import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText

#website_url = http://trustthetickets.com
website_url = "http://localhost:3000"

class TTTEmailClient(object):
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