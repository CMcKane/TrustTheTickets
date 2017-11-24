import React, {Component} from 'react';
import Time from 'react-time';
import {TTTPost} from '../../backend/ttt-request';
import {Button, Panel, Modal, Grid, Col, Row} from 'react-bootstrap';
import '../../../stylesheet.css';
import AuthService from "../../auth/auth-service";


export default class CreateListingConfirmModal extends Component {

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
            pdfLinks: this.props.pdfLinks,
            ticketPrice: this.props.ticketPrice,
            token: this.props.token
        }
    }

    handleChange(e) {
        this.setState({ticketsEntered: e.target.value});
    }

    onHide() {
        this.setState({
            busy: false
        });
        this.props.onHide();
    }

    onSubmit(){

        var success = false;

        TTTPost('/create-ticket-listing', {
            numberOfTickets: this.props.numberOfTickets,
            dbGameDate: this.props.dbGameDate,
            section: this.props.section,
            row: this.props.row,
            seatsInfo: this.props.seatsInfo,
            minPurchaseSize: this.props.minPurchaseSize,
            pdfLinks: this.props.pdfLinks,
            ticketPrice: this.props.ticketPrice,
            token: this.props.token} )
                .then(res => {
                success = res.data.success});
    }

    getErrorText() {
        if (this.props.modalSubmitError) {
            return (
                <div style={{color: 'red', float: 'left'}}>
                    There was an error creating the listing. Please try again.
                </div>
            );
        }
    }

    getCursorStatus() {
        if (this.state.busy) {
            return {cursor: 'wait'};
        }
        return {cursor: 'pointer'}
    }

    renderExtrasLabels(aisle, entry, handicap) {

        var extras = [];


        if (aisle) {
            extras.push(<Col lg={3}><p className='listingConfirmModalText'>Aisle Seat</p></Col>)
        }
        if (entry) {
            extras.push(<Col lg={3}><p className='listingConfirmModalText'>Early Entry</p></Col>)
        }
        if (handicap) {
            extras.push(<Col lg={3}><p className='listingConfirmModalText'>Handicap Accessible</p></Col>)
        }
        if (!aisle && !entry && !handicap) {
            extras.push(<Col lg={10}><p className='listingConfirmModalText'>No Extras For This Ticket</p></Col>)
        }

        return extras;
    }

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

    renderSeatsValues() {

        var labels = [];
        if (this.props.seatsInfo.length > 0) {
            for (var i = 1; i <= this.props.numberOfTickets; i++) {

                var seat = this.props.seatsInfo[i - 1].seat[0].seatNum;
                var aisleCheck = this.props.seatsInfo[i - 1].seat[0].aisleSeat;
                var earlyEntryCheck = this.props.seatsInfo[i - 1].seat[0].earlyEntry;
                var handicapAccessibleCheck = this.props.seatsInfo[i - 1].seat[0].handicapAccessible;

                labels.push(
                    <Panel>
                        <div>
                            <Row>
                                <div className="globalCenterThis">
                                <Col lg={5}>
                                    <p className='listingConfirmModalText' 
                                        style={{display: "inline", fontWeight: "bold"}}>{"Seat Number " + i + ": "}</p>
                                    <p className='listingConfirmModalText' style={{display: "inline"}}>{seat}</p>
                                </Col>
                                <Col lg={5}>
                                    <p className='listingConfirmModalText' 
                                        style={{display: "inline", fontWeight: "bold"}}>Ticket Extras</p>
                                    <div>
                                        <Row>
                                            {this.renderExtrasLabels(aisleCheck, earlyEntryCheck, handicapAccessibleCheck)}
                                        </Row>
                                    </div>
                                </Col>
                                </div>
                            </Row>
                        </div>
                    </Panel>
                )
            }
            return labels;
        }
    }

    render() {
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
                    <Grid className="confirmListingGrid">
                        <Col xs={12} sm={9} md={11} lg={9} className="confirmListingCol">
                        <div>
                            <Panel style={{padding: "15px"}}>
                                <div className="globalCenterThis">
                                    <Row>
                                        <div className="globalCenterThis">
                                        <Col lg={8}>
                                            <p className='listingConfirmModalText' 
                                                style={{fontWeight: "bold"}}>Game Date: </p>
                                            <p className='listingConfirmModalText'>
                                            <Time value={this.props.dbGameDate} format="MMMM D, YYYY h:mmA"/></p>
                                        </Col>
                                        <Col lg={8}>
                                            <p className='listingConfirmModalText'
                                                style={{display: "inline", fontWeight: "bold"}}>Opponent Name: </p>
                                            <p className='listingConfirmModalText'
                                                style={{display: "inline"}}>{this.props.opponentName}</p>
                                        </Col>
                                        </div>
                                    </Row>
                                </div>
                            </Panel>
                            <Panel style={{padding: "15px"}}>
                                <div><Panel>
                                    <Row>
                                        <div className="globalCenterThis">
                                        <Col lg={5}>
                                            <p className='listingConfirmModalText'
                                                style={{display: "inline", fontWeight: "bold"}}>Section Number: </p>
                                            <p className='listingConfirmModalText'
                                                style={{display: "inline"}}>{this.props.section}</p>
                                        </Col>
                                        <Col lg={5}>
                                            <p className='listingConfirmModalText'
                                                style={{display: "inline", fontWeight: "bold"}}>Row Number: </p>
                                            <p className='listingConfirmModalText'
                                                style={{display: "inline"}}>{this.props.row}</p>
                                        </Col>
                                        </div>
                                    </Row>
                                </Panel>
                                    <Row style={{paddingBottom: "20px"}}>
                                        {this.renderSeatsValues()}
                                    </Row>
                                </div>
                            </Panel>
                            <Panel style={{padding: "15px"}}>
                                <div>
                                    <Row>
                                        <div className="globalCenterThis">
                                        <Col lg={5}>
                                            {this.displayGroupSizeLabel()}
                                        </Col>
                                        <Col lg={5}>
                                            <p className='listingConfirmModalText'
                                                style={{display: "inline", fontWeight: "bold"}}>Price Per Ticket: </p>
                                            <p className='listingConfirmModalText'
                                                style={{display: "inline"}}>${this.props.ticketPrice}</p>
                                        </Col>
                                        </div>
                                    </Row>
                                </div>
                            </Panel>
                        </div>
                    </Col>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    {this.getErrorText()}
                    <Button onClick={() => this.props.onHide()}>Close</Button>
                    <Button onClick={this.onSubmit.bind(this)}>Submit Listing</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
