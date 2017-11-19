import React, {Component} from 'react';
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
    Modal,
    OverlayTrigger,
    Panel,
    PanelGroup,
    Radio,
    Row,
    Tooltip
} from 'react-bootstrap';
import Time from 'react-time';
import {TTTGet, TTTPost, TTTPostFile} from '../../backend/ttt-request';
import _ from 'lodash';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css'
import '../../../stylesheet.css';
import CreateListingModal from "./create-listing-modal";

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
            activeKey: 1,
            numberOfTickets: 0,
            section: null,
            row: null,
            seatNumbers: [],
            opponentName: "76ers vs ????",
            ticketPrice: 0.00,
            minPurchaseSize: 0,
            isAisleSeat: false,
            isEarlyEntry: false,
            hasObstructedView: false,
            isWheelchairSpace: false,
            sellAsGroup: false,
            opponents: [],
            gameDates: [],
            gameDate: null,
            disableChooseOpponent: true,
            show: false,
            modalSubmitError: null,

        };

        this.getGameDates();
    }

    getOpponentName(gameDate) {
        TTTPost("/get-opponent-by-date", {gameDate: gameDate})
            .then(res => {
                this.setState({
                    opponentNames: res.data.opponentName,
                    gameDate: gameDate,
                    disableChooseOpponent: false
                });
            });
    }

    getGameDates() {
        TTTGet("/get-game-dates")
            .then(res => {
                this.setState({gameDates: res.data.date});
            });
    }

    renderGameDates() {
        return _.map(this.state.gameDates, (date, index) =>
            <option
                key={index}
                value={new Date(date.date).toISOString().slice(0, 19).replace('T', ' ')}>
                {<Time value={date.date} format="MMMM D, YYYY h:mmA"/>}
            </option>
        );
    }

    renderOpponent() {
        return _.map(this.state.opponentNames, (name, index) =>
            <option key={index}
                    value={name.team_name}>
                {name.team_name}
            </option>
        );
    }

    renderSeatNumberForms() {
        var fieldGroups = [];
        for (var i = 1; i <= this.state.numberOfTickets; i++) {

            fieldGroups.push(
                <div className="globalCenterThis">
                    <Row>
                        <Col lg={6}>
                            <FieldGroup className="createListingSeatNumberForms"
                                        key={i}
                                        id={"seatNumberForm " + i}
                                        type={"text"}
                                        label={"Ticket " + i + " Seat Number"}
                                        placeholder={"Enter Seat Number"}/>
                        </Col>
                        <Col lg={6}>
                            <FormGroup id={"extrasGroup " + i}>
                                <Checkbox>Aisle Seat</Checkbox>
                                <Checkbox>Early Entry</Checkbox>
                                <Checkbox>Handicap Accessible</Checkbox>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>)
        }
        return fieldGroups;
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSelectNext() {
        switch (this.state.activeKey) {
            case 1:
                if (this.state.gameDate !== null && this.state.opponentName !== null) {
                    this.setState({activeKey: this.state.activeKey + 1});
                } else {
                    alert("Please pick a game to move onto the next step.");
                }
                break;
            case 2:
                if (this.state.numberOfTickets > 0) {
                    this.setState({activeKey: this.state.activeKey + 1});
                } else {
                    alert("Please select a number of tickets to move onto the next step.");
                }
                break;
            case 3:
                //if(this.state.section !== null && this.state.row !== null && this.state.seatNumbers !== null){
                this.setState({activeKey: this.state.activeKey + 1});
                //} else {
                //    alert("Please fill out section, row and seat numbers to move onto the next step.");
                //}
                break;
            case 4:
                this.setState({activeKey: this.state.activeKey + 1})
                break;
            case 5:
                this.setState({activeKey: this.state.activeKey + 1})
                break;
            case 6:
                this.setState({activeKey: this.state.activeKey + 1})
                break;
            default:
                this.setState({activeKey: 1});
        }
    }

    handleSelectBack() {
        this.setState({activeKey: --this.state.activeKey})
    }

    handleDateChoice(e) {
        this.getOpponentName(e.target.value);
    }

    onFileChange(e) {
        var formData = new FormData();
        formData.append("pdf", e.target.files[0]);
        TTTPostFile('/upload-pdf', formData);
    }

    createModal() {
        this.setState({
            show: !this.state.show,
        });
    }

    onHide() {
        this.setState({
            show: false
        });
    }

    changeNumberOfTickets(newNumberOfTickets) {
        this.setState({numberOfTickets: newNumberOfTickets, show: false});
    }

    render() {
        return (
            <div style={{width: '80%', paddingTop: '3%', paddingLeft: '20%'}}>
                <PanelGroup activeKey={this.state.activeKey} accordion={true}>
                    <Panel header="Step 1: What game are you selling tickets for?" eventKey={1}>
                        <div className='globalCenterThis'>
                            <Form>
                                <FormGroup>
                                    <ControlLabel>Choose Game Date</ControlLabel>
                                    <FormControl componentClass="select"
                                                 bsSize="small"
                                                 placeholder="Game Date"
                                                 name="gameDate"
                                                 onChange={this.handleDateChoice.bind(this)}
                                                 style={{width: '200px'}}>
                                        {this.renderGameDates()}
                                    </FormControl>

                                    <ControlLabel>Opponent Team</ControlLabel>
                                    <FormControl componentClass="select"
                                                 id="opponentSelect"
                                                 disabled={this.state.disableChooseOpponent}
                                                 bsSize="small"
                                                 placeholder="Opponent"
                                                 name="opponentName"
                                                 onChange={this.handleChange.bind(this)}
                                                 style={{width: '200px'}}>
                                        {this.renderOpponent()}
                                    </FormControl>
                                </FormGroup>
                                <ButtonToolbar className="globalCenterThis">
                                    <Button onClick={this.handleSelectNext.bind(this)}>Next Step</Button>
                                </ButtonToolbar>
                            </Form>
                        </div>
                    </Panel>
                    <Panel header="Step 2: How many tickets are you selling?" eventKey={2}>
                        <div className="globalCenterThis">
                            <Grid>
                                <Col>
                                    <Row>
                                        <div className="globalCenterThis">
                                            <ButtonToolbar>
                                                <Button bsSize="large" onClick={this.handleChange.bind(this)}
                                                        name='numberOfTickets'
                                                        value={1}>1</Button>
                                                <Button bsSize="large" onClick={this.handleChange.bind(this)}
                                                        name='numberOfTickets'
                                                        value={2}>2</Button>
                                                <Button bsSize="large" onClick={this.handleChange.bind(this)}
                                                        name='numberOfTickets'
                                                        value={3}>3</Button>
                                            </ButtonToolbar>
                                        </div>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <div className="globalCenterThis">
                                            <ButtonToolbar>
                                                <Button bsSize="large" onClick={this.handleChange.bind(this)}
                                                        name='numberOfTickets'
                                                        value={4}>4</Button>
                                                <Button bsSize="large" onClick={this.handleChange.bind(this)}
                                                        name='numberOfTickets'
                                                        value={5}>5</Button>
                                                <Button bsSize="large" onClick={this.createModal.bind(this)}>?</Button>
                                            </ButtonToolbar>
                                        </div>
                                        <CreateListingModal
                                            modalSubmitError={this.state.modalSubmitError}
                                            show={this.state.show}
                                            onHide={this.onHide.bind(this)}
                                            changeNumberOfTickets={this.changeNumberOfTickets.bind(this)}/>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <ButtonToolbar className="globalCenterThis">
                                            <Button onClick={this.handleSelectBack.bind(this)}>Prev Step</Button>
                                            <Button onClick={this.handleSelectNext.bind(this)}>Next Step</Button>
                                        </ButtonToolbar>
                                    </Row>
                                </Col>
                            </Grid>
                        </div>
                    </Panel>
                    <Panel header="Step 3: Where are the seats located?" eventKey={3}>
                        <div className="globalCenterThis">
                            <Grid>
                                <div>
                                    <Panel>
                                        <Row className="globalCenterThis">
                                            <Col lg={4}>
                                                <Form id="seatsForm">
                                                    <OverlayTrigger placement="bottom"
                                                                    overlay={<Tooltip id="sectionToolTip">Section Number
                                                                        is applied to all tickets.</Tooltip>}>
                                                        <FieldGroup className="createListingSeatNumberForms"
                                                                    id="sectionNumberForm"
                                                                    type="text"
                                                                    label="Section Number"
                                                                    placeholder="Enter Section Number"/>
                                                    </OverlayTrigger>
                                                </Form>
                                            </Col>
                                            <Col lg={4}>
                                                <Form>
                                                    <OverlayTrigger placement="bottom"
                                                                    overlay={<Tooltip id="sectionToolTip">Row Number is
                                                                        applied to all tickets.</Tooltip>}>
                                                        <FieldGroup className="createListingSeatNumberForms"
                                                                    id="rowNumberForm"
                                                                    type="text"
                                                                    label="Row Number"
                                                                    placeholder="Enter Row Number"/>
                                                    </OverlayTrigger>
                                                </Form>
                                            </Col>
                                        </Row>
                                    </Panel>
                                </div>
                                <br/>
                                <div>
                                    <Panel style={{padding: "10px"}}>
                                        <Col>
                                            {this.renderSeatNumberForms()}
                                        </Col>
                                    </Panel>
                                </div>
                                <div style={{paddingTop: "15px"}}>
                                    <Row>
                                        <ButtonToolbar className="globalCenterThis">
                                            <Button onClick={this.handleSelectBack.bind(this)}>Prev Step</Button>
                                            <Button onClick={this.handleSelectNext.bind(this)}>Next Step</Button>
                                        </ButtonToolbar>
                                    </Row>
                                </div>
                            </Grid>
                        </div>
                    </Panel>
                    <Panel header="Step 4: Selling Information" eventKey={4}>
                        <div className="globalCenterThis">
                            <Grid>
                                <div className="globalCenterThis">
                                    <Col>
                                        <Row>
                                            <h2>Ticket Groupings</h2>
                                        </Row>
                                        <Row>
                                            <FormGroup>
                                                <Radio name={"splitTicketsGroup"}>Sell tickets in groups of
                                                    <Form>
                                                        <FieldGroup id="minPurchaseSizeForm"
                                                                    type="text"
                                                                    placeholder="Min Purchase Size"
                                                                    name="minPurchaseSize"
                                                                    value={this.state.minPurchaseSize}
                                                                    onChange={this.handleChange.bind(this)}
                                                        />
                                                    </Form>
                                                </Radio>
                                                <Radio name={"splitTicketsGroup"}>Sell any quantity of tickets</Radio>
                                            </FormGroup>
                                        </Row>

                                        <Row>
                                            <ButtonToolbar className="globalCenterThis">
                                                <Button onClick={this.handleSelectBack.bind(this)}>Prev Step</Button>
                                                <Button onClick={this.handleSelectNext.bind(this)}>Next Step</Button>
                                            </ButtonToolbar>
                                        </Row>
                                    </Col>
                                </div>
                            </Grid>
                        </div>
                    </Panel>
                    <Panel header="Step 5: How much per ticket?" eventKey={5}>
                        <div>
                            <Form>
                                <FieldGroup id="ticketPriceForm"
                                            type="text"
                                            label="Price Per Ticket ($)"
                                            placeholder="Enter Ticket Price"
                                            name="ticketPrice"
                                            value={this.state.ticketPrice}
                                            onChange={this.handleChange.bind(this)}
                                />
                            </Form>
                            <ButtonToolbar className="globalCenterThis">
                                <Button onClick={this.handleSelectBack.bind(this)}>Prev Step</Button>
                                <Button onClick={this.handleSelectNext.bind(this)}>Next Step</Button>
                            </ButtonToolbar>
                        </div>
                    </Panel>
                    <Panel header="Step 6: Upload Ticket" eventKey={6}>
                        <div className="globalCenterThis">
                            <Grid>
                                <Col>
                                    <div className="globalCenterThis">
                                    <Row>
                                        <Form>
                                            <FieldGroup
                                                id="formControlsFile"
                                                type="file"
                                                label="Upload a PDF of the Tickets"
                                                help="First scan your tickets to a PDF file, then upload them here!"
                                                onChange={this.onFileChange.bind(this)}/>
                                        </Form>
                                    </Row>
                                    </div>
                                    <Row>
                                        <ButtonToolbar className="globalCenterThis">
                                            <Button onClick={this.handleSelectBack.bind(this)}>Prev Step</Button>
                                            <Button>Create Listing</Button>
                                        </ButtonToolbar>
                                    </Row>
                                </Col>
                            </Grid>
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        );
    }

}