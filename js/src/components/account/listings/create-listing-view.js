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
import { BarLoader } from 'react-spinners';
import 'react-datepicker/dist/react-datepicker.css';
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

/**
* This is the main view of when a user creates a listing.
*/
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
            pdfFile: null,
            sectionNumberError: false,
            rowNumberError: false,
            ticketValInProgress: false
        };

        this.getGameDates();
    }

    /**
    * Database call to retrieve the sixers opponent on a specific date.
    * @param gameDate - the game date.
    */
    getOpponentName(gameDate) {
        TTTPost("/get-opponent-by-date", {gameDate: gameDate})
            .then(res => {
                this.setState({
                    opponentNames: res.data.opponentName,
                    gameDate: gameDate
                });
            });
    }

    /**
    * Retrieves all the game dates for the user to select from.
    */
    getGameDates() {
        TTTGet("/get-game-dates")
            .then(res => {
                this.setState({
                    gameDates: res.data.date
                });
                this.loadFormattedGameDates();
            });
    }

    /**
    * Formats the game dates that were retrieved.
    */
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

    /**
    * Get the integer index value for each game date.
    * @param gamDate - the game date.
    */
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

    /**
    * Renders the game dates for the create listing view.
    */
    renderGameDates() {
        return _.map(this.state.gameDates, (date, index) =>
            <option
                key={index}
                value={new Date(date.date).toISOString().slice(0, 19).replace('T', ' ')}>
                {<Time value={date.date} format="MMMM D, YYYY h:mmA"/>}
            </option>
        );
    }

    /**
    * Renders the opponents for the user to choose from.
    */
    renderOpponent() {

        this.state.disableChooseOpponent = false;

        return _.map(this.state.opponentNames, (name, index) =>
            <option key={index}
                    value={name.team_name}>
                {name.team_name}
            </option>
        );
    }

    /**
    * Dynamically render the fields used for the user to specify the details of each seat.
    * Builds the form based on the number of seats specified in the previous part.
    */
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
                                        label={"Ticket " + i + " Seat #"}
                                        placeholder={"Enter Seat #"}
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

    /**
    * Gets the error text if the section is not valid.
    */
    getSectionErrorText() {
        if (this.state.sectionNumberError) {
            return "Invalid Section #";
        }
        else if(this.state.rowNumberError)
        {
            return <br />;
        }
    }

    /**
    * Gets the error text if the row is invalid.
    */
    getRowErrorText() {
        if (this.state.rowNumberError) {
            return "Invalid Row #";
        }
        else if(this.state.sectionNumberError)
        {
            return <br />;
        }
    }

    /**
    * Handle changing of target values.
    */
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    // check the user's section number input and if not valid, display warning
    handleSectionNumberChange(e){
        this.setState({[e.target.name]: e.target.value, sectionNumberError: !e.target.value.match(/^[\d]{3}[aA]?$/)});
    }

    // check the user's row number input and if not valid, display warning
    handleRowNumberChange(e){
        this.setState({[e.target.name]: e.target.value, rowNumberError: !e.target.value.match(/^[\d]{1,3}$/)});
    }

    /**
    * Handle when the user hits the next form arrow when creating the listing.
    */
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
                // validation has happened before handleSelectNext was called in this case
                // just advance to the next step
                this.setState({activeKey: this.state.activeKey + 1});
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

    /**
    * Handle when the user hits the back arrow when creating the listing.
    */
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

    /**
    * Handle when the user selects a specific date.
    */
    handleDateChoice(e) {
        var dbGameDateIndex = this.getGameDataIndex(e.target.value);
        this.setState({dbGameDate: this.state.gameDates[dbGameDateIndex].date});
        this.getOpponentName(e.target.value);
    }

    /**
    * Handle when the value of the minimum purchase radio button changes.
    * @param value - the radio button value.
    */
    handleRadioChange(value) {

        this.setState({selectedValue: value});

        if (value === "1") {
            this.state.disableMinPurchaseSizeForm = false;
        } else {
            this.state.disableMinPurchaseSizeForm = true;
            this.state.minPurchaseSize = 1;
        }
    }

    /**
    * Handle the minimum purchase size change.
    */
    handleMinPurchaseSizeChange(e){
            this.setState({[e.target.name]: e.target.value});
    }


    /**
    * Handle when the PDF file link changes.
    */
    onFileChange(e) {
        this.setState({
            pdfFile: e.target.files[0]
        });
    }

    /**
    * Create the modal that displays a summary of the listing. after the user submits the listing.
    */
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

    /**
    * Hide the modal.
    */
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

    /**
    * Handle the changing of the number of tickets in the listing.
    */
    changeNumberOfTickets(newNumberOfTickets) {
        this.setState({numberOfTickets: newNumberOfTickets, show: false});
    }

    // check the ticket information input by the user with simple pattern tests
    // we will still have to validate the information with the database later on
    checkTicketInfoInput()
    {
        // check valid section num
        if(!this.state.section.match(/^[\d]{3}[aA]?$/))
        {
            alert("Please enter a valid section number.");
            return false;
        }

        // check valid row num
        if(!this.state.row.match(/^[\d]{1,3}$/))
        {
            alert("Please enter a valid row number.");
            return false;
        }

        this.state.seatsInfo = [];

        var seatNums = [];
        // check valid seat numbers
        for(var i = 1; i <= this.state.numberOfTickets; i++) {
            if(document.getElementById('seatNumberForm' + i).value.match(/^[\d ]*$/) && document.getElementById('seatNumberForm' + i).value !== ""){
                var form = document.getElementById('seatNumberForm' + i).value;
                var check1 = document.getElementById('aisleSeatCheck' + i).checked;
                var check2 = document.getElementById('earlyEntryCheck' + i).checked;
                var check3 = document.getElementById('handicapAccessibleCheck' + i).checked;
                this.state.seatsInfo.push({seat: [{seatNum: form, aisleSeat: check1, earlyEntry: check2, handicapAccessible: check3}]});
                seatNums.push(form);
            }
            else
            {
                alert("Please enter a valid seat number.");
                this.state.seatsInfo = [];
                return false;
            }
        }

        // check seat logic
        var failedSeatLogicCheck = false;
        for(var i = 1; i < seatNums.length; i++)
        {
            var cur = parseInt(seatNums[i]);
            var prev = parseInt(seatNums[i-1]);
            if(cur == prev)
            {
                // at least one of the seat numbers is equal to the previous one
                alert("Ticket seat numbers must be unique. Please fix and then try again.");
                failedSeatLogicCheck = true;
                break;
            }
            if(cur < prev)
            {
                // at least one of the seat numbers isn't greater than the previous one
                alert("Ticket seat numbers are not in ascending order. Please fix and then try again.");
                console.log(seatNums[i] + ", " + seatNums[i - 1]);
                failedSeatLogicCheck = true;
                break;
            }
            if(cur - prev != 1)
            {
                // at least one of the seat numbers isn't adjacent to the previous one.
                alert("Ticket seat numbers are not adjacent. Please fix and then try again.")
                failedSeatLogicCheck = true;
                break;
            }
        }

        if(failedSeatLogicCheck)
        {
            this.state.seatsInfo = [];
            return false;
        }

        return true;
    }

    /**
    * Backend call to validate that the ticket information is valid information to list.
    */
    validateTicketsFromDB()
    {
        if(this.checkTicketInfoInput())
        {
            this.setState({
                ticketValInProgress: true
            });
            TTTPost('/validate-ticket-info', {
                sectionNum: this.state.section,
                rowNum: this.state.row,
                seatNums: this.state.seatsInfo,
                gameDate: this.state.gameDate
            }).then(res => {

                var correctInfo = true;

                // checking location information returned from the back end

                // comment once done debugging:
                console.log(res.data.ticketInfoResults.locationResults);
                // save variables for reference
                var sectionNumValid = res.data.ticketInfoResults.locationResults.sectionNumValid;
                var rowNumValid = res.data.ticketInfoResults.locationResults.rowNumValid;
                var seatsValidity = res.data.ticketInfoResults.locationResults.seatsValidity;

                // check that the section exists
                if(!sectionNumValid)
                {
                    alert("Unknown Section #. Please check your tickets and try again.")
                    correctInfo = false;
                }
                // check that the row exists
                else if(!rowNumValid)
                {
                    alert("Unknown Row #. Please check your tickets and try again.")
                    correctInfo = false;
                }
                // check that the seats exist
                else
                {
                    var errorMsg = "";
                    for(var i = 0; i < seatsValidity.length; i++)
                    {
                        if(!seatsValidity[i].seatNumValid)
                        {
                            errorMsg += "Seat # " + seatsValidity[i].seatNum + " for Ticket " + (i + 1) + " does not exist.\n";
                        }
                    }
                    if(errorMsg.length > 1)
                    {
                        errorMsg += "Please check your tickets and try again.";
                        alert(errorMsg);
                        correctInfo = false;
                    }
                }

                // only perform a duplicate ticket check if the location information is good
                if(correctInfo)
                {
                    // checking for duplicate listings in the same seats that the user is trying to upload
                    console.log(res.data.ticketInfoResults.ticketListedResults);
                    var duplicates = res.data.ticketInfoResults.ticketListedResults;
                    var errorMsg = "";
                    for(var i = 0; i < duplicates.length; i++)
                    {
                        errorMsg += "Seat # " + duplicates[i].seatNum + " for Ticket " + (i + 1) + " is already listed.\n";
                    }
                    if(errorMsg.length > 1)
                    {
                        errorMsg += "Please check your tickets and try again.";
                        alert(errorMsg);
                    }
                    else
                    {
                        this.handleSelectNext();
                    }
                }

                this.setState({
                    ticketValInProgress: false
                });
            });
        }
        else
        {
            // let the user make adjustments to their input
        }
    }

    /**
    * The first rendering step.
    */
    renderStep1()
    {
        return(
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
                        <Button onClick={this.handleSelectNext.bind(this)}>►</Button>
                    </ButtonToolbar>
                </div>
            </Panel>
        )
    }

    /**
    * Renders the ticket number selection buttons.
    * @param num - the current tickent number button.
    */
    renderTicketNumberButton(num)
    {
        return(
            <Button bsSize="large" active={~~this.state.numberOfTickets===num}
                    onClick={this.handleChange.bind(this)}
                    name='numberOfTickets'
                    value={num}>{num}</Button>
        )
    }

    /**
    * Rendering step number 2
    */
    renderStep2()
    {
        return(
            <Panel header="Step 2: How many tickets are you selling?" eventKey={2}>
                <Panel>
                    <div className="globalCenterThis">
                        <Grid>
                            <Col>
                                <Row>
                                    <div className="globalCenterThis" style={{paddingTop: "10px"}}>
                                        <ButtonToolbar>
                                            {this.renderTicketNumberButton(1)}
                                            {this.renderTicketNumberButton(2)}
                                            {this.renderTicketNumberButton(3)}
                                        </ButtonToolbar>
                                    </div>
                                </Row>
                                <br/>
                                <Row>
                                    <div className="globalCenterThis">
                                        <ButtonToolbar>
                                            {this.renderTicketNumberButton(4)}
                                            {this.renderTicketNumberButton(5)}
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
                        <Button onClick={this.handleSelectBack.bind(this)}>◄</Button>
                        <Button onClick={this.handleSelectNext.bind(this)}>►</Button>
                    </ButtonToolbar>
                </div>
            </Panel>
        )
    }

    /**
    * Renders the loading spinner for validation.
    */
    renderValidationLoader()
    {
        if(this.state.ticketValInProgress)
        {
            return(
                <div>
                    Validating Tickets...
                    <br />
                    <BarLoader loading="true" width="200"/>
                </div>
            )
        }
    }

    /**
    * Rendering step number 3.
    */
    renderStep3()
    {
        return(
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
                                                            label="Section #"
                                                            placeholder="Enter Section #"
                                                            onChange={this.handleSectionNumberChange.bind(this)}/>
                                            </OverlayTrigger>
                                        </Form>
                                        <div style={{color: 'red', float: 'left'}}>
                                            {this.getSectionErrorText()}
                                        </div>
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
                                                            label="Row #"
                                                            placeholder="Enter Row #"
                                                            onChange={this.handleRowNumberChange.bind(this)}/>
                                            </OverlayTrigger>
                                        </Form>
                                        <div style={{color: 'red', float: 'left'}}>
                                            {this.getRowErrorText()}
                                        </div>
                                    </Col>
                                </Row>
                            </Panel>
                        </div>
                        <br/>
                        <div>
                            <Panel style={{padding: "10px"}}>
                                <Col>
                                    {this.renderSeatNumberForms()}
                                    <div className="globalCenterThis">
                                        {this.renderValidationLoader()}
                                    </div>
                                </Col>
                            </Panel>
                        </div>
                    </Grid>
                </div>
                <div style={{paddingTop: "15px"}}>
                    <ButtonToolbar className="globalCenterThis">
                        <Button onClick={this.handleSelectBack.bind(this)}>◄</Button>
                        <Button disabled={this.state.ticketValInProgress} onClick={this.validateTicketsFromDB.bind(this)}>►</Button>
                    </ButtonToolbar>
                </div>
            </Panel>
        )
    }

    /**
    * Rendering step number 4.
    */
    renderStep4()
    {
        return(
            <Panel header="Step 4: Selling Information" eventKey={4}>
                <div className="globalCenterThis">
                    <Grid>
                        <Panel>
                            <div className="globalCenterThis">
                                <Col>
                                    <Row>
                                        <p className="createListingSellingSizeTitle">Ticket Groupings</p>
                                    </Row>
                                    <Row>
                                        <RadioGroup className="createListingSellingSize"
                                                    name="sellingSize"
                                                    selectedValue={this.state.selectedValue}
                                                    onChange={this.handleRadioChange.bind(this)}>
                                            <label className="listingConfirmModalText">
                                                <Radio value={"1"} /> Sell tickets in groups of minimum:
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
                                            <label className="listingConfirmModalText">
                                                <Radio value={"-1"} /> Sell any quantity of tickets (Minimum 1).
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
                        <Button onClick={this.handleSelectBack.bind(this)}>◄</Button>
                        <Button onClick={this.handleSelectNext.bind(this)}>►</Button>
                    </ButtonToolbar>
                </div>
            </Panel>
        )
    }

    /**
    * Rendering step number 5.
    */
    renderStep5()
    {
        return(
            <Panel header="Step 5: How much per ticket?" eventKey={5}>
                <div className="globalCenterThis">
                    <Grid>
                        <Panel style={{paddingLeft: "15px", paddingRight: "15px"}}>
                            <div className="globalCenterThis">
                                <Col lg={4}>
                                    <Form>
                                        <Row className="createListingSellingSizeTitle">
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
                                                            onChange={this.handleChange.bind(this)}/>
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
                        <Button onClick={this.handleSelectBack.bind(this)}>◄</Button>
                        <Button onClick={this.handleSelectNext.bind(this)}>►</Button>
                    </ButtonToolbar>
                </div>
            </Panel>
        )
    }

    /**
    * Rendering step number 6.
    */
    renderStep6()
    {
        return(
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
                        <Button onClick={this.handleSelectBack.bind(this)}>◄</Button>
                        <Button onClick={this.createModal.bind(this)}>Create Listing</Button>
                    </ButtonToolbar>
                </div>
            </Panel>
        )
    }

    /**
    * Main rendering loop.
    */
    render() {
        return (
            <div style={{paddingTop: '3%'}}>
                <Grid>
                    <Col xs={0} sm={1} md={1} lg={2}>
                    </Col>
                    <Col xs={12} sm={10} md={9} lg={8}>
                        <PanelGroup activeKey={this.state.activeKey} accordion={true}>
                            {this.renderStep1()}
                            {this.renderStep2()}
                            {this.renderStep3()}
                            {this.renderStep4()}
                            {this.renderStep5()}
                            {this.renderStep6()}
                        </PanelGroup>
                        <Col xs={0} sm={1} md={1} lg={2}>
                        </Col>
                    </Col>
                </Grid>
                <CreateListingConfirmModal {...this.state}
                           modalSubmitError={this.state.modalSubmitError}
                           show={this.state.showConfirm}
                           onHide={this.onHide.bind(this)}/>
            </div>
        );
    }
}