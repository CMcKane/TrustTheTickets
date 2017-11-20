import React, {Component} from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well,
        Button, Panel, ToggleButtonGroup, ToggleButton, ButtonGroup,
        DropdownButton, MenuItem, Modal} from 'react-bootstrap';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import { ClimbingBoxLoader } from 'react-spinners';
import '../../stylesheet.css';
import 'rc-slider/assets/index.css';
import queryString from 'query-string';


export default class CheckoutView extends Component {

    constructor(props) {
        super(props);

        const queryParams = queryString.parse(this.props.location.search);
        console.log(queryParams);
    }
    render() {
        return (
            <div className=" globalBody globalImage">
                <Grid style={{paddingTop: "25px"}}>
                    <h1>
                        <Well className='checkoutHeader'>
                            Checkout
                        </Well>
                    </h1>
                </Grid>
            </div>
        );
    }

}