import React, { Component, Button}  from 'react';
import '../../stylesheet.css';
import { Document, Page } from 'react-pdf';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dropzone from 'react-dropzone';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';


var docFiles = []

const style = {
  margin: 15,
};


export default class ImportDownload extends Component {

    state = {
        file: '',
        numPages: null,
        pageNumber: 2,
        filesPreview:[],
        filesToBeSent:[],
        printcount:10
    }

    onFileChange = (event) => {
        this.setState({
            file: event.target.files[0],
        });
    }


    //may not be needed...
    downloadPDF() {
        TTTPost('/split-pdf', {
            file: this.state.file
        })
            .then(res => {
                if(res.data.files) {
                    this.setState({
                        splitfiles: this.state.splitfiles
                    })
                }
            });
    }

    saveDocs() {

        for (var i=0; i < this.state.numPages; i++) {
            docFiles[i] = (<Document file={this.state.file}>
                               <Page pageNumber={i} />
                           </Document>)
        }
    }

    onDocumentLoadSuccess = ({ numPages }) =>
        this.setState({
            numPages
        })

    onDrop(acceptedFiles, rejectedFiles) {
          // console.log('Accepted files: ', acceptedFiles[0].name);
          var filesToBeSent=this.state.filesToBeSent;
          if(filesToBeSent.length < this.state.printcount){
            filesToBeSent.push(acceptedFiles);
            var filesPreview=[];
            for(var i in filesToBeSent){
              filesPreview.push(<div>
                {filesToBeSent[i][0].name}
                <MuiThemeProvider>
                <a href="#"><FontIcon
                  className="material-icons customstyle"
                  color={blue500}
                  styles={{ top:10,}}
                >clear</FontIcon></a>
                </MuiThemeProvider>
                </div>
              )
            }
            this.setState({filesToBeSent,filesPreview});
          }
          else{
            alert("You have reached the limit of printing files at a time")
          }
    }

    download1() {
        var data = new Blob(this.state.filesToBeSent, {type: 'text/csv'});
        var csvURL = window.URL.createObjectURL(data);
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'filename.csv');
        tempLink.click();
    }

    download() {
        const rows = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function(rowArray){
           let row = rowArray.join(",");
           csvContent += row + "\r\n"; // add carriage return
        });

        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }

    render() {
        return (
            <div className="App">
                <center>
                    <div>
                        You can upload upto {this.state.printcount} files at a time.
                    </div>

                    <Dropzone onDrop={(files) => this.onDrop(files)}>
                        <div>Try dropping some files here, or click to select files to upload.</div>
                    </Dropzone>
                    <div>
                        Files to be printed are:
                        {this.state.filesPreview}
                    </div>
                </center>
                <div>
                    {this.state.printingmessage}
                </div>
                <div>
                    <button onclick="this.download()">Download</button>
                </div>
            </div>
        );
    }

}
