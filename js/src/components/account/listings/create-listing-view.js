import React, {Component} from 'react';
import {
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
    OverlayTrigger,
    Panel,
    PanelGroup,
    Row,
    Tooltip
} from 'react-bootstrap';
import Time from 'react-time';
import {TTTGet, TTTPost, TTTPostFile} from '../../backend/ttt-request';
import _ from 'lodash';
import 'react-datepicker/dist/react-datepicker.css'
import '../../../stylesheet.css';
import CreateListingModal from "./create-listing-modal";
import CreateListingConfirmModal from "./create-listing-confirm-modal"
import {RadioGroup, Radio} from 'react-radio-group';
import AuthService from "../../auth/auth-service";

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

        this.Auth = new AuthService();
        this.state = {
            activeKey: 1,
            numberOfTickets: 0,
            section: "",
            row: "",
            seatsInfo: [],
            opponentName: "",
            ticketPrice: "",
            sellAsGroup: false,
            minPurchaseSize: "",
            opponentNames: [],
            gameDates: [],
            formattedGameDates: [],
            gameDate: "",
            dbGameDate: "",
            disableChooseOpponent: true,
            show: false,
            showConfirm: false,
            modalSubmitError: "",
            disableMinPurchaseSizeForm: false,
            selectedValue: "1",
            token: this.Auth.getToken(),
            pdfFile: null
        };

        this.getGameDates();
    }

    getOpponentName(gameDate) {
        TTTPost("/get-opponent-by-date", {gameDate: gameDate})
            .then(res => {
                this.setState({
                    opponentNames: res.data.opponentName,
                    gameDate: gameDate
                });
            });
    }

    getGameDates() {
        TTTGet("/get-game-dates")
            .then(res => {
                this.setState({
                    gameDates: res.data.date
                });
                this.loadFormattedGameDates();
            });
    }

    loadFormattedGameDates(){
        var fgd = [];
        for(var i = 0; i < this.state.gameDates.length; i++)
        {
            fgd.push(new Date(this.state.gameDates[i].date).toISOString().slice(0, 19).replace('T', ' '));
        }
        this.setState({
            formattedGameDates: fgd
        });
    }

    getGameDataIndex(gameDate)
    {
        for(var i = 0; i < this.state.gameDates.length; i++)
        {
            if(this.state.formattedGameDates[i] == gameDate)
            {
                return i;
            }
        }
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

        this.state.disableChooseOpponent = false;

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
                <div className="globalCenterThis" key={i}>
                    <Row>
                        <Col lg={6}>
                            <FieldGroup className="createListingSeatNumberForms"
                                        key={i}
                                        id={"seatNumberForm" + i}
                                        type={"text"}
                                        label={"Ticket " + i + " Seat Number"}
                                        placeholder={"Enter Seat Number"}
                            />
                        </Col>
                        <Col lg={6}>
                            <FormGroup id={"extrasGroup" + i}>
                                <Checkbox id={"aisleSeatCheck" + i} checked={this.checked}>Aisle
                                    Seat</Checkbox>
                                <Checkbox id={"earlyEntryCheck" + i} checked={this.checked}>Early
                                    Entry</Checkbox>
                                <Checkbox id={"handicapAccessibleCheck" + i} checked={this.checked}
                                          >Handicap Accessible</Checkbox>
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

    handleSeatInfoChange(e) {
        if(e.target.value.match(/^[\d ]*$/)){
            this.setState({[e.target.name]: e.target.value});
        } else {
            alert("Please enter a valid number for section and/or row.");
        }
    }

    handleSelectNext() {

        switch (this.state.activeKey) {
            case 1:
                if (this.state.gameDate !== null && this.state.opponentName !== "Pick An Opponent" && this.state.opponentName !== "") {
                    this.setState({activeKey: this.state.activeKey + 1});
                } else {
                    alert("Please pick a game and an opponent to move onto the next step.");
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

                for(var i = 1; i <= this.state.numberOfTickets; i++) {
                    if(document.getElementById('seatNumberForm' + i).value.match(/^[\d ]*$/) && document.getElementById('seatNumberForm' + i).value !== ""){
                        var form = document.getElementById('seatNumberForm' + i).value;
                        var check1 = document.getElementById('aisleSeatCheck' + i).checked;
                        var check2 = document.getElementById('earlyEntryCheck' + i).checked;
                        var check3 = document.getElementById('handicapAccessibleCheck' + i).checked;
                        this.state.seatsInfo.push({seat: [{seatNum: form, aisleSeat: check1, earlyEntry: check2, handicapAccessible: check3}]});
                    }else{
                        alert("Please enter a valid seat number.");
                        this.state.seatsInfo = [];
                        return
                    }
                }

                if (this.state.section !== "" && this.state.row !== "" && this.state.seatsInfo !== null) {

                    this.setState({activeKey: this.state.activeKey + 1});

                } else {
                    alert("Please fill out section, row and seat numbers to move onto the next step.");
                }
                break;
            case 4:
                if(this.state.minPurchaseSize === "" || this.state.minPurchaseSize > this.state.numberOfTickets || this.state.minPurchaseSize === "0"){
                    alert("Please pick a minimum group size for selling tickets to move onto the next step.");
                } else {
                    this.setState({activeKey: this.state.activeKey + 1});
                }
                break;
            case 5:
                if(this.state.ticketPrice === "" || !this.state.ticketPrice.match(/^[0-9]*(\.[0-9]{2})?$/)){
                    alert("Please set a ticket price to move onto the next step.");
                } else if(this.state.ticketPrice.match(/^[0-9]*$/)){
                    this.setState({ticketPrice: this.state.ticketPrice + ".00",
                    activeKey: this.state.activeKey + 1});
                }else {
                    this.setState({activeKey: this.state.activeKey + 1});
                }
                break;
            case 6:
                this.setState({activeKey: this.state.activeKey + 1});
                break;
            default:
                this.setState({activeKey: 1});
        }
    }

    handleSelectBack() {

        switch (this.state.activeKey) {
            case 1:
                this.setState({activeKey: this.state.activeKey - 1});
                break;
            case 2:
                this.setState({activeKey: this.state.activeKey - 1});
                break;
            case 3:
                this.setState({activeKey: this.state.activeKey - 1});
                break;
            case 4:
                this.state.seatsInfo = [];
                this.setState({activeKey: this.state.activeKey - 1});
                break;
            case 5:
                this.setState({activeKey: this.state.activeKey - 1});
                break;
            case 6:
                this.setState({activeKey: this.state.activeKey - 1});
                break;
            default:
                this.setState({activeKey: 1});
        }
    }

    handleDateChoice(e) {
        var dbGameDateIndex = this.getGameDataIndex(e.target.value);
        this.setState({dbGameDate: this.state.gameDates[dbGameDateIndex].date});
        this.getOpponentName(e.target.value);
    }

    handleRadioChange(value) {

        this.setState({selectedValue: value});

        if (value === "1") {
            this.state.disableMinPurchaseSizeForm = false;
        } else {
            this.state.disableMinPurchaseSizeForm = true;
            this.state.minPurchaseSize = 1;
        }
    }

    handleMinPurchaseSizeChange(e){
            this.setState({[e.target.name]: e.target.value});
    }


    onFileChange(e) {
        this.setState({
            pdfFile: e.target.files[0]
        });
    }

    createModal() {
        if(this.state.activeKey === 2){
            this.setState({
                show: !this.state.show
            });
        }else if (this.state.activeKey === 6){
            if(this.state.pdfFile === null){
                alert("Please upload a PDF file with your tickets.")
            }else{
                this.setState({
                    showConfirm: !this.state.showConfirm
                });
            }
        }
    }

    onHide() {
        if(this.state.show){
            this.setState({
                show: false
            });
        }
        if(this.state.showConfirm){
            this.setState({
                showConfirm: false
            })
        }
    }

    changeNumberOfTickets(newNumberOfTickets) {
        this.setState({numberOfTickets: newNumberOfTickets, show: false});
    }

    render() {
        return (
            <div style={{paddingTop: '3%'}}>
                <Grid>
                    <Col xs={0} sm={1} md={1} lg={2}>
                    </Col>
                    <Col xs={12} sm={10} md={8} lg={8}>
                        <PanelGroup activeKey={this.state.activeKey} accordion={true}>
                            <Panel header="Step 1: What game are you selling tickets for?" eventKey={1}>
                                <Panel>
                                    <div className='globalCenterThis'>
                                        <Form>
                                            <FormGroup>
                                                <ControlLabel>Choose Game Date</ControlLabel>
                                                <FormControl componentClass="select"
                                                             bsSize="small"
                                                             placeholder="Game Date"
                                                             name="gameDate"
                                                             value={this.state.gameDate}
                                                             onChange={this.handleDateChoice.bind(this)}
                                                             style={{width: '200px'}}>
                                                    <option value={null}>Select a Game Date</option>
                                                    {this.renderGameDates()}
                                                </FormControl>

                                                <ControlLabel>Opponent Team</ControlLabel>
                                                <FormControl componentClass="select"
                                                             id="opponentSelect"
                                                             bsSize="small"
                                                             disabled={this.state.disableChooseOpponent}
                                                             placeholder="Opponent"
                                                             name="opponentName"
                                                             onChange={this.handleChange.bind(this)}
                                                             style={{width: '200px'}}>
                                                    <option value={null}>Pick An Opponent</option>
                                                    {this.renderOpponent()}
                                                </FormControl>
                                            </FormGroup>
                                        </Form>
                                    </div>
                                </Panel>
                                <div className="globalCenterThis" style={{paddingTop: "15px"}}>
                                    <ButtonToolbar className="globalCenterThis">
                                        <Button onClick={this.handleSelectNext.bind(this)}>Next Step</Button>
                                    </ButtonToolbar>
                                </div>
                            </Panel>
                            <Panel header="Step 2: How many tickets are you selling?" eventKey={2}>
                                <Panel>
                                    <div className="globalCenterThis">
                                        <Grid>
                                            <Col>
                                                <Row>
                                                    <div className="globalCenterThis" style={{paddingTop: "10px"}}>
                                                        <ButtonToolbar>
                                                            <Button bsSize="large" active={~~this.state.numberOfTickets===1}
                                                                    onClick={this.handleChange.bind(this)}
                                                                    name='numberOfTickets'
                                                                    value={1}>1</Button>
                                                            <Button bsSize="large" active={~~this.state.numberOfTickets===2}
                                                                    onClick={this.handleChange.bind(this)}
                                                                    name='numberOfTickets'
                                                                    value={2}>2</Button>
                                                            <Button bsSize="large" active={~~this.state.numberOfTickets===3}
                                                                    onClick={this.handleChange.bind(this)}
                                                                    name='numberOfTickets'
                                                                    value={3}>3</Button>
                                                        </ButtonToolbar>
                                                    </div>
                                                </Row>
                                                <br/>
                                                <Row>
                                                    <div className="globalCenterThis">
                                                        <ButtonToolbar>
                                                            <Button bsSize="large" active={~~this.state.numberOfTickets===4}
                                                                    onClick={this.handleChange.bind(this)}
                                                                    name='numberOfTickets'
                                                                    value={4}>4</Button>
                                                            <Button bsSize="large" active={~~this.state.numberOfTickets===5}
                                                                    onClick={this.handleChange.bind(this)}
                                                                    name='numberOfTickets'
                                                                    value={5}>5</Button>
                                                            <Button bsSize="large" active={~~this.state.numberOfTickets > 5}
                                                                    onClick={this.createModal.bind(this)}>?</Button>
                                                        </ButtonToolbar>
                                                    </div>
                                                    <CreateListingModal
                                                        modalSubmitError={this.state.modalSubmitError}
                                                        show={this.state.show}
                                                        onHide={this.onHide.bind(this)}
                                                        changeNumberOfTickets={this.changeNumberOfTickets.bind(this)}/>
                                                </Row>
                                                <br/>
                                            </Col>
                                        </Grid>
                                    </div>
                                </Panel>
                                <div className="globalCenterThis" style={{paddingTop: "15px"}}>
                                    <ButtonToolbar className="globalCenterThis">
                                        <Button onClick={this.handleSelectBack.bind(this)}>Prev Step</Button>
                                        <Button onClick={this.handleSelectNext.bind(this)}>Next Step</Button>
                                    </ButtonToolbar>
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
                                                                            overlay={<Tooltip id="sectionToolTip">Section
                                                                                Number
                                                                                is applied to all tickets.</Tooltip>}>
                                                                <FieldGroup className="createListingSeatNumberForms"
                                                                            id="sectionNumberForm"
                                                                            name="section"
                                                                            value={this.state.section}
                                                                            type="text"
                                                                            label="Section Number"
                                                                            placeholder="Enter Section Number"
                                                                            onChange={this.handleSeatInfoChange.bind(this)}/>
                                                            </OverlayTrigger>
                                                        </Form>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <Form>
                                                            <OverlayTrigger placement="bottom"
                                                                            overlay={<Tooltip id="sectionToolTip">Row
                                                                                Number is
                                                                                applied to all tickets.</Tooltip>}>
                                                                <FieldGroup className="createListingSeatNumberForms"
                                                                            id="rowNumberForm"
                                                                            name="row"
                                                                            value={this.state.row}
                                                                            type="text"
                                                                            label="Row Number"
                                                                            placeholder="Enter Row Number"
                                                                            onChange={this.handleSeatInfoChange.bind(this)}/>
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

                                    </Grid>
                                </div>
                                <div style={{paddingTop: "15px"}}>
                                    <ButtonToolbar className="globalCenterThis">
                                        <Button onClick={this.handleSelectBack.bind(this)}>Prev Step</Button>
                                        <Button onClick={this.handleSelectNext.bind(this)}>Next Step</Button>
                                    </ButtonToolbar>
                                </div>
                            </Panel>
                            <Panel header="Step 4: Selling Information" eventKey={4}>
                                <div className="globalCenterThis">
                                    <Grid>
                                        <Panel>
                                            <div className="globalCenterThis">
                                                <Col>
                                                    <Row>
                                                        <h2 className="createListingSellingSizeTitle">Ticket Groupings</h2>
                                                    </Row>
                                                    <Row>
                                                        <RadioGroup className="createListingSellingSize"
                                                                    name="sellingSize"
                                                                    selectedValue={this.state.selectedValue}
                                                                    onChange={this.handleRadioChange.bind(this)}>
                                                            <label>
                                                                <Radio value={"1"} />Sell tickets in groups of minimum:
                                                                <Form>
                                                                    <FieldGroup id="minPurchaseSizeForm"
                                                                                type="text"
                                                                                disabled={this.state.disableMinPurchaseSizeForm}
                                                                                placeholder="Minimum Purchase Size"
                                                                                name="minPurchaseSize"
                                                                                value={this.state.minPurchaseSize}
                                                                                onChange={this.handleMinPurchaseSizeChange.bind(this)}
                                                                    />
                                                                </Form>
                                                            </label>
                                                            <br/>
                                                            <label>
                                                                <Radio value={"-1"} />Sell any quantity of tickets (Minimum 1).
                                                            </label>
                                                        </RadioGroup>
                                                    </Row>
                                                    <br/>
                                                </Col>
                                            </div>
                                        </Panel>
                                    </Grid>
                                </div>
                                <div className="globalCenterThis" style={{paddingTop: "15px"}}>
                                    <ButtonToolbar className="globalCenterThis">
                                        <Button onClick={this.handleSelectBack.bind(this)}>Prev Step</Button>
                                        <Button onClick={this.handleSelectNext.bind(this)}>Next Step</Button>
                                    </ButtonToolbar>
                                </div>
                            </Panel>
                            <Panel header="Step 5: How much per ticket?" eventKey={5}>
                                <div className="globalCenterThis">
                                    <Grid>
                                        <Panel>
                                            <div className="globalCenterThis">
                                                <Col lg={4}>
                                                    <Form>
                                                        <Row>
                                                            <OverlayTrigger placement="bottom"
                                                                            overlay={<Tooltip id="ticketPriceToolTip">Price
                                                                                entered
                                                                                is applied to each ticket.</Tooltip>}>
                                                                <FieldGroup id="ticketPriceForm"
                                                                            type="text"
                                                                            label="Price Per Ticket ($)"
                                                                            placeholder="Enter Ticket Price"
                                                                            name="ticketPrice"
                                                                            value={this.state.ticketPrice}
                                                                            onChange={this.handleChange.bind(this)}
                                                                />
                                                            </OverlayTrigger>
                                                        </Row>
                                                    </Form>
                                                </Col>
                                            </div>
                                        </Panel>
                                    </Grid>
                                </div>
                                <div className="globalCenterThis" style={{paddingTop: "15px"}}>
                                    <ButtonToolbar className="globalCenterThis">
                                        <Button onClick={this.handleSelectBack.bind(this)}>Prev
                                            Step</Button>
                                        <Button onClick={this.handleSelectNext.bind(this)}>Next
                                            Step</Button>
                                    </ButtonToolbar>
                                </div>
                            </Panel>
                            <Panel header="Step 6: Upload Ticket" eventKey={6}>
                                <Panel>
                                    <div className="globalCenterThis">
                                        <Grid>
                                            <Col>
                                                <div className="globalCenterThis">
                                                    <Form className='createListingPdfForm'>
                                                        <FieldGroup
                                                            id="formControlsFile"
                                                            type="file"
                                                            label="Upload a PDF of the Tickets"
                                                            accept="application/pdf"
                                                            help="First scan your tickets to a PDF file, then upload them here!"
                                                            onChange={this.onFileChange.bind(this)}/>
                                                    </Form>
                                                </div>
                                            </Col>
                                        </Grid>
                                    </div>
                                </Panel>
                                <div className="globalCenterThis" style={{paddingTop: "15px"}}>
                                    <ButtonToolbar className="globalCenterThis">
                                        <Button onClick={this.handleSelectBack.bind(this)}>Prev Step</Button>
                                        <Button onClick={this.createModal.bind(this)}>Create Listing</Button>
                                    </ButtonToolbar>
                                </div>
                                <CreateListingConfirmModal {...this.state}
                                                           modalSubmitError={this.state.modalSubmitError}
                                                           show={this.state.showConfirm}
                                                           onHide={this.onHide.bind(this)}/>
                            </Panel>
                        </PanelGroup>
                        <Col xs={0} sm={1} md={1} lg={2}>
                        </Col>
                    </Col>
                </Grid>
            </div>
        );
    }
}