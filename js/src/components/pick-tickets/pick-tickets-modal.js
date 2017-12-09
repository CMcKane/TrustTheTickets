import React, { Component }  from 'react';
import { Button, Col, Modal, Form, FormGroup, ControlLabel, FormControl, ToggleButton } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import AuthService from '../auth/auth-service';

var numTicketsChecked;
var minSellNum;

export default class PickTicketsModal extends Component {

    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
            group: this.props.group,
            redirect: false,
            redirectLink: '',
            ticketsInTransaction: [],
            isValidTicketAmount: false,
        }
        numTicketsChecked = 0;
        minSellNum = 0;
    }

    getCursorStatus() {
        if (this.state.busy) {
            return {cursor: 'wait'};
        }
        return {cursor: 'pointer'}
    }

    // begins checkout process
    checkout() {
        if(this.state.ticketsInTransaction.length > 0 && this.state.ticketsInTransaction != [])
        {
            this.props.setCheckoutTickets(this.state.ticketsInTransaction);
            //this.props.fetchFees();
        }
    }

    getHeader() {
        return ("Tickets for sale");
    }

    getTicketContent() {
        if(this.props.group)
        {
            var list = [];
            var tempTicket = this.props.group[0];
            minSellNum = tempTicket.min_sell_num;
            list.push(
                <p>
                    Section: {tempTicket.section_number} &emsp;
                    Row: {tempTicket.row_number} &emsp;
                    Price: ${tempTicket.ticket_price.toFixed(2)} /ea
                </p>
            );

            var seatNums = [];
            for(var i = 0; i < this.props.group.length; i++)
            {
                seatNums.push(parseInt(this.props.group[i].seat_number));
            }
            // console.log(seatNums);
            // seatNums.sort();
            // console.log(seatNums);
            var sortedIndexes = [];
            for(var i = 0; i < this.props.group.length; i++)
            {
                for(var j = 0; j < this.props.group.length; j++)
                {
                    if(seatNums[i] == this.props.group[j].seat_number)
                    {
                        sortedIndexes.push(j);
                        j = this.props.group.length;
                    }
                }
            }

            for(var i = 0; i < this.props.group.length; i++)
            {
                var currTicket = this.props.group[sortedIndexes[i]];
                list.push(
                    <p className="ticketBorder">
                        <p className="ticketAttributes">Seat: {currTicket.seat_number}
                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                            <input
                                className="checkBox"
                                type="checkbox"
                                id={sortedIndexes[i]}
                                value={sortedIndexes[i]+1}
                                onChange={this.handleTicketSelect.bind(this)}>
                            </input>
                        </p>
                    </p>
                );
            }
            return(<div > {list} </div>);
        }
    }

    handleTicketSelect(e) {
        var id = e.target.id;
        var selectedArr = this.state.ticketsInTransaction;
        if(e.target.checked === true) {
            selectedArr.push(this.props.group[id]);
            numTicketsChecked++;
        } else {
            for(var i = 0; i < selectedArr.length; i++) {
                if(this.props.group[id] === selectedArr[i]) {
                    selectedArr.splice(i, 1);
                }
            }
            numTicketsChecked--;
        }
        this.setState({ticketsInTransaction: selectedArr});
    }

    closeModal() {
        this.onHide();
        this.setState({ticketsInTransaction: []});
    }

    onHide() {
        this.setState({
            busy: false
        });
        this.props.onHide();
    }

    getErrorText() {
        if (this.props.modalSubmitError) {
            return (
                <div style={{color: 'red', float: 'left'}}>
                    There was an error updating your ticket price. Please try again.
                </div>
            );
        }
    }

    validSeatSelections()  {
        var valid = false;
        var arr = this.state.ticketsInTransaction;
        if(arr && this.state.group)
        {
            if(arr.length === this.state.group.length || arr.length === 1) {
                valid = true;
            }
            else {
                var sortedArr = [];
                for(var i = 0; i < arr.length; i++) {
                    sortedArr[i] = parseInt(arr[i].seat_number);
                }
                sortedArr = sortedArr.sort();
                console.log(sortedArr);

                for(var i = 0, j = 1; j < sortedArr.length; i++, j++) {
                    console.log(sortedArr[i] + 1);
                    console.log(sortedArr[j]);
                    if((sortedArr[i] + 1) != sortedArr[j]) {
                        valid = false;
                        return valid;
                    }
                    else {
                        valid = true;
                    }
                }
            }
        }
        return valid;
    }

    renderButtonOptions() {
        if(minSellNum <= numTicketsChecked && this.validSeatSelections()){
            return(<Button onClick={this.checkout.bind(this)}>Buy</Button>);
        }
        else{
            return(<div> The minimum you must purchase is {minSellNum}. <br/>
                         Please check at least {minSellNum} tickets.</div>);
        }
    }

    render() {
        if(this.state.redirect)
        {
            return <Redirect to={this.state.redirectLink} />
        }
        else
        {
            return (
                <Modal style={this.getCursorStatus()} onHide={this.onHide.bind(this)}
                       show={this.props.show} bsSize="large" aria-labelledby="contained-modal-title-sm">
                    <Modal.Header className="pickTicketModalHeader" closeButton>
                        <Modal.Title id="contained-modal-title-sm">Tickets</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pickTicketModalBody">
                        <h4>{this.getHeader()}</h4>
                        {this.getTicketContent()}
                    </Modal.Body>
                    <Modal.Footer className="pickTicketModalHeader">
                        {this.getErrorText()}
                        {this.renderButtonOptions()}
                        <Button onClick={this.closeModal.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
    }
}