import React, { Component, FieldGroup}  from 'react';
import '../../stylesheet.css';
import { Document, Page } from 'react-pdf';
import {TTTPost, TTTGet, TTTPostFile} from '../backend/ttt-request';
import { Button } from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dropzone from 'react-dropzone';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';


export default class ImportDownload extends Component {

    state = {
        files:[]
    }

    sendFiles(evt) {
        var formData = new FormData();
        formData.append("pdf", evt.target.files[0]);
        formData.append("startId", 101);
        formData.append("endId", 103);

        TTTPostFile('/split-pdf', formData)
        /*

            .then(res => {
                if(res.data.splitfiles) {
                    for (var i = 0; i < res.data.splitfiles.length; i++) {
                        this.state.files[i] = res.data.splitfiles[i];
                    }
                }
            });
        */
    }

    getFilesByEmail() {
        TTTPost("/combine-pdf", {
            email: 'derekmgaffney@gmail.com',
            ticketIds: [
                101, 103
            ]
        })
    }

    render() {
        return (
            <div className="App">

                    <input type="file" id="files" onChange={ (evt) => this.sendFiles(evt, 'files') }
                           name="files[]" multiple
                    />
                    <Button onClick={this.getFilesByEmail.bind(this)}>
                        Email my tickets
                    </Button>
            </div>
        );
    }

}

//<Dropzone onDrop={(files) => this.onDrop(files)}>
//                        <div>Try dropping some files here, or click to select files to upload.</div>
//                    </Dropzone>
//<div>
//                        Files to be printed are:
//                        {this.state.filesPreview}
//                    </div>
//<div>
//                    <button onclick="this.download()">Download</button>
//                </div>