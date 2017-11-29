import React, {Component} from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well,
        Button, Panel, ToggleButtonGroup, ToggleButton, ButtonGroup,
        DropdownButton, MenuItem, Modal, Table} from 'react-bootstrap';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import { ClimbingBoxLoader } from 'react-spinners';
import 'rc-slider/assets/index.css';
import queryString from 'query-string';

var queryParams = null

export default class CheckoutView extends Component {

    constructor(props) {
        super(props);

        queryParams = queryString.parse(this.props.location.search);
        console.log(queryParams.price);
        this.state = {
            group: this.props.group,
            redirect: false,
            redirectLink: ''
        }
    }

    buildTicketInfoRendering() {
        return(
        <div className="checkoutBody">
            <table class="table">
                <thead>
                    <th className="tableHeading">Section</th>
                    <th className="tableHeading">Row</th>
                    <th className="tableHeading">Seat</th>
                    <th className="tableHeading">Price</th>
                </thead>
                <tr>
                    <td>{queryParams.section}</td>
                    <td>{queryParams.row}</td>
                    <td>{queryParams.seat}</td>
                    <td>${queryParams.price}</td>
                </tr>
            </table>
            <br></br>
            <table class="table">
                <thead>
                    <th className="tableHeading">Comments</th>
                    <th className="tableHeading">Disclosures</th>
                </thead>
                <tr>
                    <td>
                        <li>Handicap</li>
                        <li>Early Access</li>
                    </td>
                    <td>
                        <li>None</li>
                    </td>
                </tr>
            </table>
            <br></br>
            <table class="table">
                <tr>
                    <th className="tableHeading">Bill</th>
                    <td>Subtotal: $80</td>
                    <td>Fees: $8</td>
                    <td>Total: $88</td>
                </tr>
            </table>
    </div>
        );
    }

    render() {
        return (
            <div className="globalBody globalImage globalImageOverlay">
                <Grid style={{paddingTop: "25px"}}>
                    <h1>
                        <Well className='checkoutHeader'>
                            Checkout
                        </Well>
                    </h1>
                    {this.buildTicketInfoRendering()}
                </Grid>
            </div>
        );
    }

}
