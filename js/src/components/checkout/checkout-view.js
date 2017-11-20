import React, {Component} from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well,
        Button, Panel, ToggleButtonGroup, ToggleButton, ButtonGroup,
        DropdownButton, MenuItem, Modal} from 'react-bootstrap';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import { ClimbingBoxLoader } from 'react-spinners';
import '../../stylesheet.css';
import 'rc-slider/assets/index.css';

export default class CheckoutView extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className=" globalBody globalImage">
                <div>  </div>
            </div>
        );
    }

}