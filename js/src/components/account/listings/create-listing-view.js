import React, {Component} from 'react';
import {render} from 'react-dom';
import {
    Accordion,
    Button,
    ButtonToolbar,
    Checkbox,
    Col,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    Grid,
    HelpBlock,
    Panel,
    Radio,
    Row
} from 'react-bootstrap';
import {TTTGet, TTTPost} from '../../backend/ttt-request';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import '../../../stylesheet.css';

function FieldGroup({id, label, help, ...props}) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

export default class CreateListingView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            numberOfTickets: 1,
            section: 0,
            opponentName: null,
            ticketPrice: 0,
            isAisleSeat: false,
            isEarlyEntry: false,
            hasObstructedView: false,
            isWheelchairSpace: false,
            sellAsGroup: false,
            teams: [],
            startDate: moment(),
        };

        this.getOpponentNames();
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    getOpponentNames() {
        TTTGet("/all-teams")
            .then(res => {
                this.setState({teams: res.data.teams});
            });
    }

    renderOpponentNames() {
        return _.map(this.state.teams, (team) =>
            <option value={team.team_name}>{team.team_name}</option>
        );
    }

    renderSeatNumberForms() {
        var fieldGroups = []
        for (var i = 1; i < this.state.numberOfTickets+1; i++) {
            fieldGroups.push(<FieldGroup className="createListingSeatNumberForms"
                                         id={"seatNumberForm " + i}
                                         type={"text"}
                                         label={"Seat Number " + i + " Form"}
                                         placeholder={"Enter the Seat Number for Seat " + i}/>)
        }
        return fieldGroups;
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    render() {
        return (
            <div style={{width: '80%', paddingTop: '3%', paddingLeft: '20%'}}>
                <Accordion defaultActiveKey={1}>
                    <Panel header="Step 1: What game are you selling tickets for?" eventKey={1}>
                        <div>
                            <Grid>
                                <Col md={2} lg={4}>
                                    <Form>
                                        <FormGroup>
                                            <ControlLabel style={{paddingRight: "10px"}}>Opponent Team</ControlLabel>
                                            <FormControl componentClass="select"
                                                         bsSize="medium"
                                                         placeholder="Opponent"
                                                         name="opponentName"
                                                         onChange={this.handleChange.bind(this)}
                                                         style={{width: '200px'}}>
                                                <option value={null}>Pick Opponent</option>
                                                {this.renderOpponentNames()}
                                            </FormControl>
                                        </FormGroup>
                                    </Form>
                                    <br/>
                                </Col>
                                <Col md={2} lg={4}>
                                    <ControlLabel>Pick Game Date/Time</ControlLabel>
                                    <DatePicker selected={this.state.startDate}
                                                onChange={this.handleDateChange}
                                                showTimeSelect
                                                timeIntervals={30}
                                                dateFormat="LLL"
                                                withPortal
                                    />
                                </Col>

                            </Grid>
                        </div>
                    </Panel>
                    <Panel header="Step 2: How many tickets are you selling?" eventKey={2}>
                        <div className="globalCenterThis">
                            <ButtonToolbar>
                                <Button bsSize="large">1</Button>
                                <Button bsSize="large">2</Button>
                                <Button bsSize="large">3</Button>
                                <Button bsSize="large">4</Button>
                                <Button bsSize="large">5</Button>
                                <Button bsSize="large">6+</Button>
                            </ButtonToolbar>
                        </div>
                    </Panel>
                    <Panel header="Step 3: Where are the seats located?" eventKey={3}>
                        <div className="globalCenterThis">
                            <Form id="seatsForm">
                                <FieldGroup className="createListingSeatNumberForms"
                                            id="sectionNumberForm"
                                            type="text"
                                            label="Section Number"
                                            placeholder="Enter Section Number"/>
                                <FieldGroup className="createListingSeatNumberForms"
                                            id="rowNumberForm"
                                            type="text"
                                            label="Row Number"
                                            placeholder="Enter Row Number"/>
                                {this.renderSeatNumberForms()}
                            </Form>
                        </div>
                    </Panel>
                    <Panel header="Step 4: Comments, Disclosures & Extras" eventKey={4}>
                        <div>
                            <Grid>
                                <Row>
                                    <Col md={2} lg={3}>
                                        <h2>Comments</h2>
                                        <FormGroup>
                                            <Radio name={"splitTicketsGroup"}>Sell tickets in even groups</Radio>
                                            <Radio name={"splitTicketsGroup"}>Sell any quantity of tickets</Radio>
                                        </FormGroup>
                                    </Col>
                                    <Col md={2} lg={3}>
                                        <h2>Disclosures</h2>
                                        <FormGroup>
                                            <Checkbox>Obstructed View</Checkbox>
                                            <Checkbox>Wheelchair Space</Checkbox>
                                        </FormGroup>
                                    </Col>
                                    <Col md={2} lg={3}>
                                        <h2>Extras</h2>
                                        <FormGroup>
                                            <Checkbox>Aisle Seat</Checkbox>
                                            <Checkbox>Early Entry</Checkbox>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                    </Panel>
                    <Panel header="Step 5: How much per ticket?" eventKey={5}>
                        <div>

                        </div>
                    </Panel>
                    <Panel header="Step 6: Upload Ticket" eventKey={6}>
                        <div className="globalCenterThis">
                            <Form>
                                <FieldGroup
                                    id="fromControlsFile"
                                    type="file"
                                    label="Upload a PDF of the Tickets"
                                    help="First scan your tickets to a PDF file, then upload them here!"
                                />
                            </Form>
                        </div>
                    </Panel>
                </Accordion>
            </div>
        );
    }

}