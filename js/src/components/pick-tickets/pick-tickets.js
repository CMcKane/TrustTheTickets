import React, { Component } from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel,
        FormControl, Well, ListGroup, ListGroupItem} from 'react-bootstrap';
import '../../seating-chart.css';
import '../pick-tickets/pick-tickets.css';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import { TTTPost } from '../backend/ttt-request';
import ReactSliderNativeBootstrap from 'react-bootstrap-native-slider';



import TicketListItem from './ticket-list-item';

//"Fake" data -- Thank you DT for the word "fake"
const tickets = [
{
    section_number: "112",
    row_number: "1",
    seat_number: "7",
    price: "45",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
}
]

export default class PickTickets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            section: '',
            eventID: '',
            tickets: this.getTickets() //[]
        }
    }

    //Retrieves every ticket for a specific event
    getAllTickets(eventID) {
        if (eventID.length != '') {
            TTTPost('/all-tickets', {
                event_id: eventID
            })
            .then(res => {
                if (res.data.tickets) this.setState({
                    eventID: eventID,
                    tickets: res.data.tickets
                });
            });
        }
    }

    onChartClick(section) {
        if(section.length > 0) {
            TTTPost('/tickets', {
                section_number: section
            })
            .then(res => {
                if (res.data.tickets) this.setState({
                    section: section,
                    tickets: res.data.tickets
                });
            });
            
        }
    }

    //display faux tickets
    getTickets() {
        return tickets;
    }

    //render the values in the tickets
    renderTicketList() {
        return _.map(this.state.tickets, (ticket, id) =>
            <ListGroupItem className="tickets" id={ticket.event_id} >
                Section: {ticket.section_number} Row: {ticket.row_number} Seat: {ticket.seat_number} Price: {ticket.price}
            </ListGroupItem>
        );
    }

    firstComponentChangeValue(e) {
      console.log("AHHHHHHHHHHHHHHHHHHHHHH");
      console.log(this.state.priceChange);
      this.setState({ firstComponentCurrentValue: e.target.value });
      this.setState({ priceChange: e.target.value });
      return e.target.value;

    }

    handleOnChange = (value) => {
    this.setState({
      price: value
    })
  }

    render(){
        return (
            <Grid>
                <h1 className="border-white">
                    <Well className='pick-tickets-well' style={{background: 'transparent'}}>
                        Choose Your Desired Section From The Seating Chart
                    </Well>
                </h1>
                <Row>
                    <Col lg={8}>
                    <Col lg={4}>
                        <button type="game-button" class="btn btn-secondary">
                        76ers vs. Wizards </button>
                    </Col>
                        <WellsFargoChart
                        onSectionSelected={this.onChartClick.bind(this)}
                        selectedSection={this.state.section}/>
                    </Col>
                    <Col lg={4}>

                        <div>
                                <ReactSliderNativeBootstrap
                                     max={50}
                                     min={1}
                                     step={1}
                                     tooltip="hide"
                                     change={this.firstComponentChangeValue}
                                     value={this.state.firstComponentCurrentValue}
                                />

                                <ControlLabel
                                    id = "sliderPrice"
                                    style={{color: 'white', fontSize: 15}}>
                                    {this.state.price}
                                </ControlLabel>

                            <form>
                                <ControlLabel style={{color: 'white', fontSize: 15}}>Section #: </ControlLabel>
                                <input name="param1" value="test"/>
                                <input type="submit" name="" id="search-submit" class="button" value="Submit"/>
                            </form>

                            <FormGroup controlId="formControlsSelectMultiple">
                                <ControlLabel style={{color: 'white', fontSize: 25}}>Here are your ticket options for selected section: </ControlLabel>
                                <FormControl style={{height: '650px'}} componentClass="select" multiple>
                                {this.renderTickets()}
                                </FormControl>
                            </FormGroup>




                        </div>}
                    </Col>
                    <Col lg={4}>
                        {
                        <div>
                            <span>{this.props.todo}</span>
                            <input type="checkbox" checked={this.props.done} />

                            <form>
                              <input name="param1" value="test"/>
                                <input name="param2" value=""/>
                                <input type="submit" name="" id="search-submit" class="button" value="Submit"/>
                            </form>
                        </div>
                      }
                        <h3 className="text-center"> Tickets </h3>
                        <ListGroup className="list-of-tickets">
                            {this.renderTicketList()}
                        </ListGroup>
                    </Col>
                </Row>
            </Grid>
        );
    }
}