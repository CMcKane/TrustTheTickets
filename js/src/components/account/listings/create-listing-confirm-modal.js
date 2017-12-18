import React, {Component} from 'react';
import Time from 'react-time';
import {TTTPost} from '../../backend/ttt-request';
import {Button, Panel, Modal, Grid, Col, Row} from 'react-bootstrap';
import AuthService from '../../auth/auth-service';
import withAuth from '../../auth/with-auth';
import {Redirect} from 'react-router-dom';

/**
* This modal is created when after the listing is created by the user.
* It contains details about the soon to be listing created by the user.
*/
class CreateListingConfirmModal extends Component {
    /**
    * Constructor.
    */
    constructor(props) {
        super(props);

        this.state = {
            numberOfTickets: this.props.numberOfTickets,
            opponentName: this.props.opponentName,
            gameDate: this.props.gameDate,
            dbGameDate: this.props.dbGameDate,
            section: this.props.section,
            row: this.props.section,
            seatsInfo: this.props.seatsInfo,
            minPurchaseSize: this.props.minPurchaseSize,
            ticketPrice: this.props.ticketPrice,
            token: this.props.token,
            pdfFile: this.props.pdfFile,
            redirect: false
        }
    }

    /**
    * Handle the changing of the number of tickets.
    */
    handleChange(e) {
        this.setState({ticketsEntered: e.target.value});
    }

    /**
    * Hides the modal.
    */
    onHide() {
        this.setState({
            busy: false
        });
        this.props.onHide();
    }

    /**
    * Create the PDF and call the backend to create the new listing when user submits the new listing.
    */
    onSubmit(){
        var success = false;

        var formData = new FormData();
        formData.append("pdf", this.props.pdfFile);
        formData.append("allJson", JSON.stringify({
            numberOfTickets: this.props.numberOfTickets,
            dbGameDate: this.props.gameDate,
            section: this.props.section,
            row: this.props.row,
            seatsInfo: this.props.seatsInfo,
            minPurchaseSize: this.props.minPurchaseSize,
            ticketPrice: this.props.ticketPrice,
            token: this.props.token
        }));
        TTTPost('/send-listing-data', formData).then(res => {
            success = res.data.success
            this.setState({redirect: true});
            this.onHide();
        });
    }

    /**
    * Get the error text if the user makes a mistake.
    */
    getErrorText() {
        if (this.props.modalSubmitError) {
            return (
                <div style={{color: 'red', float: 'left'}}>
                    There was an error creating the listing. Please try again.
                </div>
            );
        }
    }

    /**
    * Gets the status of the cursor.
    */
    getCursorStatus() {
        if (this.state.busy) {
            return {cursor: 'wait'};
        }
        return {cursor: 'pointer'}
    }

    /**
    * Return the labels that show aisle, entry, handicap, etc.
    * @param aisle - the aisle seat extra.
    * @param entry - the early entry extra.
    * @param handicap - the handicap seat extra.
    */
    renderExtrasLabels(aisle, entry, handicap) {

        var extras = ""
        var numExtras = 0

        if (aisle) {
            extras = "Aisle Seat";
            numExtras++;
        }
        if (entry) {
            if (numExtras > 0) extras += ", Early Entry";
            else extras += "Early Entry"
            numExtras++;
        }
        if (handicap) {
            if (numExtras > 0) extras += ", Handicap Accessible";
            else extras += "Handicap Accessible"
            numExtras++;
        }
        if (numExtras === 0) {
            extras = "No Extras For This Ticket"
        }

        return extras;
    }

    /**
    * Displays the label for indicate the ticket group size.
    */
    displayGroupSizeLabel() {

        let arr = [];
        if (this.props.minPurchaseSize !== 1) {
            arr.push(<div><p className='listingConfirmModalText' 
                    style={{display: "inline", fontWeight: "bold"}}>Minimum Ticket Groupings: </p>
                <p className='listingConfirmModalText' style={{display: "inline"}}>{this.props.minPurchaseSize}</p></div>)
        } else {
            arr.push(<p className='listingConfirmModalText'
                style={{display: "inline", fontWeight: "bold"}}>Selling Tickets Individually</p>)
        }

        return arr;
    }

    /**
    * Render the values of the seats such as their extras.
    */
    renderSeatsValues() {

        var labels = [];
        if (this.props.seatsInfo.length > 0) {
            for (var i = 1; i <= this.props.seatsInfo.length; i++) {

                var seat = this.props.seatsInfo[i - 1].seat[0].seatNum;
                var aisleCheck = this.props.seatsInfo[i - 1].seat[0].aisleSeat;
                var earlyEntryCheck = this.props.seatsInfo[i - 1].seat[0].earlyEntry;
                var handicapAccessibleCheck = this.props.seatsInfo[i - 1].seat[0].handicapAccessible;
                // Push each seat.
                labels.push(
                    <div>
                    <Col xs={6} sm={5} md={5} lg={4} style={{paddingLeft: "0px"}}>
                        <p className='listingConfirmModalText' 
                            style={{display: "inline", fontWeight: "bold"}}>{"Seat Number: "}
                        </p>
                        <p className='listingConfirmModalText' style={{display: "inline"}}>
                        {seat}
                        </p>
                    </Col>
                    <Col xs={5} sm={5} md={5} lg={5} style={{paddingLeft: "0px"}}>
                        <p className='listingConfirmModalText' 
                            style={{display: "inline", fontWeight: "bold"}}>{"Ticket Extras: " }
                        </p>
                        <p className='listingConfirmModalText' style={{display: "inline"}}>
                        {this.renderExtrasLabels(aisleCheck, earlyEntryCheck, handicapAccessibleCheck)}
                        </p>
                    </Col>
                    </div>
                );
            }
            return labels;
        }
    }
    /**
    * Handle when the page is refreshed by the user.
    */
    refreshPage() {
        window.location.reload();
    }

    /**
    * Main rendering loop.
    */
    render() {
        if(this.state.redirect){
            this.refreshPage();
        }else {
            return (
                <Modal style={this.getCursorStatus()} onHide={this.onHide.bind(this)}
                       show={this.props.show} bsSize="large" aria-labelledby="contained-modal-title-sm">
                    <Modal.Header closeButton>
                        <Modal.Title><h2 className='listingConfirmModalTitle'>
                            Review Your Listing</h2></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h3 className='listingConfirmTitle'>
                            Please confirm all fields are correct before creating your listing.</h3>
                        <Panel>
                        <Grid className="confirmListingGrid" style={{fontSize: "12px", paddingLeft: "0px !important"}}>
                            <Col xs={6} sm={5} md={5} lg={4} style={{paddingLeft: "0px"}}>
                                <p className='listingConfirmModalText'
                                   style={{fontWeight: "bold", display: "inline"}}>{"Game Date: "}
                                </p>
                                <p className='listingConfirmModalText' style={{display: "inline"}}>
                                   <Time value={this.props.dbGameDate} format="MMMM D, YYYY h:mmA"/>
                                </p>
                            </Col>
                            <Col xs={5} sm={5} md={5} lg={5} style={{paddingLeft: "0px"}}>
                                <p className='listingConfirmModalText'
                                   style={{display: "inline", fontWeight: "bold"}}>
                                   {"Opponent Name: "}
                                </p>
                                <p className='listingConfirmModalText' style={{display: "inline"}}>
                                   {this.props.opponentName}
                                </p>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                            </Col>
                            <Col xs={6} sm={5} md={5} lg={4} style={{paddingLeft: "0px"}}>
                                <p className='listingConfirmModalText'
                                   style={{display: "inline", fontWeight: "bold"}}>
                                  {"Section Number: "} 
                                </p>
                                <p className='listingConfirmModalText'
                                   style={{display: "inline"}}>
                                   {this.props.section}
                                </p>
                            </Col>
                            <Col xs={5} sm={5} md={5} lg={5} style={{paddingLeft: "0px", paddingBottom: "10px"}}>
                                <p className='listingConfirmModalText'
                                   style={{display: "inline", fontWeight: "bold"}}>{"Row Number: "}
                                </p>
                                <p className='listingConfirmModalText'
                                   style={{display: "inline"}}>{this.props.row}
                                </p>
                            </Col>
                            <div style={{paddingLeft: "0px"}}>
                            {this.renderSeatsValues()}
                            </div>
                            <Col xs={12} sm={12} md={12} lg={12} style={{paddingTop: "10px", paddingLeft: "0px"}}>
                                {this.displayGroupSizeLabel()}
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} style={{paddingLeft: "0px"}}>
                                <p className='listingConfirmModalText'
                                   style={{display: "inline", fontWeight: "bold"}}>Price Per Ticket: </p>
                                <p className='listingConfirmModalText'
                                   style={{display: "inline"}}>${this.props.ticketPrice}</p>
                            </Col>
                        </Grid>
                        </Panel>
                    </Modal.Body>
                    <Modal.Footer>
                        {this.getErrorText()}
                        <Button bsStyle="primary" onClick={this.onSubmit.bind(this)}>Submit Listing</Button>
                        <Button onClick={() => this.props.onHide()}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }
}
export default withAuth(CreateListingConfirmModal);
