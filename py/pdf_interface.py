from PyPDF2 import PdfFileWriter, PdfFileReader
import io

class PDFWorker(object):

    def __init__(self, s3worker):
        self.s3worker = s3worker

    # input:
    #   file from request.file['pdf']
    #   array of ticket id's
    def splitPDF(self, file, ticketIds):
        inputPDF = PdfFileReader(file)

        if ticketIds[len(ticketIds) - 1] - ticketIds[0] + 1 != inputPDF.numPages:
            print("ERROR: PDF does not have the same number of pages as the number of tickets being uploaded.")
            print("Tickets could not be uploaded.")
            return False
        else:
            for i in range(inputPDF.numPages):
                outputStream = io.BytesIO()
                output = PdfFileWriter()
                output.addPage(inputPDF.getPage(i))
                output.write(outputStream)
                outputStream.seek(0)
                self.s3worker.uploadFile(outputStream, ticketIds[i])
        return True

    # input
    #   array of ticket id's
    def getCombinedPDF(self, ticketIds):
        outputStream = io.BytesIO()
        output = PdfFileWriter()

        for i in ticketIds:
            curFileStream = io.BytesIO()
            curFileStream = self.s3worker.downloadFile(str(i))
            curInputPDF = PdfFileReader(curFileStream)
            output.appendPagesFromReader(curInputPDF)

        output.write(outputStream)
        outputStream.seek(0)
        return outputStream