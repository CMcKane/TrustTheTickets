import React, { Component }  from 'react';
import '../../stylesheet.css';
import { Document, Page } from 'react-pdf';
import {TTTPost, TTTGet} from '../backend/ttt-request';

export default class ImportDownload extends Component {

    state = {
        splitfiles: [],
        file: './sample.pdf',
        numPages: null,
    }

    onFileChange = (event) => {
        this.setState({
            file: event.target.files[0],
        });
    }

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

    onDocumentLoadSuccess = ({ numPages }) =>
        this.setState({
        numPages,
    })

    render() {
        return (
            <div>
                {this.state.splitfiles}
                <div>
                    <div>
                        <label htmlFor="file">Load from file:</label>
                        <input type="file" onChange={this.onFileChange}/>
                    </div>
                    <div>
                        <a href="this.state.splitfiles" download>
                            <button type="submit">Download</button>
                        </a>
                            <Document file={this.state.file} onLoadSuccess={this.onDocumentLoadSuccess}>
                                {
                                    Array.from(
                                        new Array(this.state.numPages),
                                        (el, index) => (
                                            <Page key={`page_${index + 1}`} pageNumber={index + 1}
                                                onRenderSuccess={this.onPageRenderSuccess}
                                                width={Math.min(600, document.body.clientWidth - 52)}
                                            />
                                        ),
                                    )
                                }
                            </Document>
                    </div>
                </div>
            </div>
        );
    }

}
