from flask import jsonify
from flask_mysqldb import MySQL
from sql_handler import SqlHandler
from account_jwt import JWTService

class ListingCreator(object):

    def __init__(self, mysql, pdfworker, json, file):
        self.mysql = mysql
        self.pdfworker = pdfworker
        self.json = json
        self.file = file

    def createListing(self):
        sqlHandler = SqlHandler(self.mysql)
        jwt_service = JWTService()
        jsonData = self.json

        sectionNum = jsonData['section']
        rowNum = jsonData['row']
        seatsInfo = jsonData['seatsInfo']
        ticketPrice = jsonData['ticketPrice']
        numberOfTickets = jsonData['numberOfTickets']
        minPurchaseSize = jsonData['minPurchaseSize']
        gameDate = jsonData['dbGameDate']
        accountID = jwt_service.get_account(jsonData['token'])

        print("sectionNum: " + sectionNum)
        print("rowNum: " + rowNum)
        print("seatsInfo:")
        print(seatsInfo)
        print("ticketPrice: " + ticketPrice)
        print("numberOfTickets: " + numberOfTickets)
        print("minPurchaseSize: " + minPurchaseSize)
        print("gameDate: " + gameDate)
        print("accountID: " + str(accountID))

        # success = sqlHandler.insert_ticket_listing(sectionNum, rowNum, seatsInfo, ticketPrice, pdfLinks,
        #                                 numberOfTickets, minPurchaseSize, gameDate, accountID)

        mysqlInsertSuccess = True

        ticketIds = [1,2,3,4]

        fileUploadSuccess = self.pdfworker.splitPDF(self.file, ticketIds)

        return mysqlInsertSuccess and fileUploadSuccess