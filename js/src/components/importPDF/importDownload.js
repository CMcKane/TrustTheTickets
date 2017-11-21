import React, { Component, Button, FieldGroup}  from 'react';
import '../../stylesheet.css';
import { Document, Page } from 'react-pdf';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dropzone from 'react-dropzone';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';


export default class ImportDownload extends Component {

    state = {
        files:[]
    }

    callTTT(evt) {
        var formData = new FormData();
        formData.append("pdf", evt.target.files[0]);

        TTTPost('/split-pdf', formData )
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

    render() {
        return (
            <div className="App">

                    <input type="file" id="files" onChange={ (evt) => this.callTTT(evt, 'files') }
                    name="files[]" multiple
                    />
                    <output id="list"></output>
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