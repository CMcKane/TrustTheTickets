import React, {Component} from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well, Button, Panel, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import '../../seating-chart.css';
import '../pick-tickets/pick-tickets.css';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import ReactSliderNativeBootstrap from 'react-bootstrap-native-slider';
import TicketListItem from './ticket-list-item';
import queryString from 'query-string';

var a = [];
var clickedSection = 0;

export default class PickTickets extends Component {

    constructor(props) {
        super(props);

        const queryParams = queryString.parse(this.props.location.search);
        const event_id = queryParams.event;

        this.state = {
            section: 0,
            lightedSections: [],
            tickets: [],
            price: 0,
            showFilter: false,
            selectedEvent: [],
            eventID: event_id,
            eventTitle: 'Choose a game',
            toggleValue: [1,2]
        }
        this.getEvent(event_id);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    getEventTitle() {
        return this.state.selectedEvent.title;
    }

    getEvent(eventID) {
        TTTPost('/get-event', {
            eventID: eventID
        })
        .then(res => {
            try {
                if (res.data.event.authenticated) {
                    this.setState({
                        selectedEvent: {
                            title: res.data.event.title,
                            homeTeam: res.data.event.homeTeam,
                            awayTeam: res.data.event.awayTeam
                        },
                        eventTitle: res.data.event.title
                    });
                }
            }
            catch (e) {
                console.log(e);
            }

        });
    }

    getTicketsWithFilter() {
        if(clickedSection == 0) {
            console.log("getting tickets");
            TTTPost('/get-cheap-ticket-any-section', {
                price: this.state.price,
            })
            .then(res => {
                if (res.data.tickets) this.setState({
                    tickets: res.data.tickets
                }, () => {this.setAndLightSectionsArrayFromTickets(this.state.tickets)});
            });
        } else {

            TTTPost('/pick-ticket-filter', {
                price: this.state.price,
                section: this.state.section
            })
                .then(res => {
                    if (res.data.tickets) this.setState({
                        tickets: res.data.tickets
                    });
                });
        }
    }

    setAndLightSectionsArrayFromTickets(tickets) {
        console.log(tickets);
        for(var i = 0; i < tickets.length; i++) {
            a[i] = tickets[i].section_number;
        }
        this.setState({lightedSections: a});
        console.log("arr");
        console.log(a);
    }

    getCheapestTickets() {

        TTTGet('/pick-cheapest-ticket', {
        })
            .then(res => {
                if (res.data.tickets) this.setState({
                    tickets: res.data.tickets
                });
            });
    }

     getCheapestTicketsSections() {

        TTTGet('/get-cheapest-ticket-sections', {
        })
            .then(res => {
                if (res.data.sections) this.setState({
                    lightedSections: res.data.sections
                }, () => {this.processSectionsArray(this.state.lightedSections)});
            });
    }

    getCheapestTicketsAllSections() {
        TTTPost('/get-cheap-ticket-any-section', {
            price: this.state.price,
        })
            .then(res => {
                if (res.data.tickets) this.setState({
                    tickets: res.data.tickets
                });
            });
    }

    processSectionsArray(sections) {
        var arr = [];
        for(var i = 0; i < sections.length; i++) {
            arr[i] = sections[i].section_number;
        }
        this.setState({lightedSections: arr});
        a = arr;
        console.log(a);
    }

    getAllTickets() {
        TTTPost('/all-tickets', {
            event_id: this.state.eventID
        })
            .then(res => {
                if (res.data.tickets) this.setState({
                    tickets: res.data.tickets
                });
            });

    }

    getCurrentSection() {
        if(this.state.section > 0) {
            return this.state.section;
        } else { return "All"; }
    }

    getSelectedGame() {
        if (this.state.eventID === '') {
            eventTitle: 'Choose a game'
        }
        else {
            eventTitle: this.state.selectedEvent.Title
        }
    }

    _onButtonClick() {
        this.setState({
            showFilter: true
        });
    }

    getCheapestTicketsAndSections() {
        this.getCheapestTickets();
        this.getCheapestTicketsSections();
        clickedSection = 0;
    }

    toggleChartHighlight() {
        a = [];
        this.setState({tickets: [], lightedSections: a});
    }

    onChartClick(section) {
        //this.setState({value: 0});
        clickedSection = section;
        if(section != this.state.section) {
            a = [];
            //var arr = this.state.lightedSections.slice();
            // TODO: Handle highlighting of multiple sections.
            //arr[0] = section;
            a[0] = section;
            if (section.length > 0) {
                TTTPost('/tickets', {
                    section_number: section
                })
                    .then(res => {
                        if (res.data.tickets)
                        this.setState({
                            section: section,
                            lightedSections: a,
                            tickets: res.data.tickets
                        });
                    });
            }
        }
        else {
            a = [];
            clickedSection = 0;
            this.setState({
                section: 0,
                tickets: []
                //lightedSections: []
            });
        }
    }

    firstComponentChangeValue(e) {
        this.setState({
            firstComponentCurrentValue: e.target.value,
            price: e.target.value
        });
    }

    onToggleChange = (value) => {
        this.setState({ value });
    }

    hasEventID() {
        if (this.state.eventID > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    //render the values in the tickets
    renderTicketList() {
        return _.map(this.state.tickets, (ticket, id) =>
            <li className="list-group-item" border-color="red">
                Section: {ticket.section_number} Row: {ticket.row_number}
                <br></br>
                Seat: {ticket.seat_number} Price: ${ticket.ticket_price}
                <br></br>
                <Button className="buy-button" bsSize="xsmall">Buy</Button>
            </li>
        );
    }

    render() {
        return (
        <div className="bgimg4">
            <div>
                <Grid style={{paddingTop: "100px"}}>
                    <h1 className="border-white">
                        <Well className='pick-tickets-well' style={{background: '#006BB6'}}>
                            Pick-A-Ticket
                        </Well>
                    </h1>
                    <Row>
                        <Col lg={8}>
                            <Row>
                                <Col lg={8}>
                                    <Button disabled={this.hasEventID()}>
                                        {this.state.eventTitle}
                                    </Button>
                                </Col>
                            </Row>
                            <br/>
                            <WellsFargoChart
                                onSectionSelected={this.onChartClick.bind(this)}
                                selectedSection={this.state.section}
                                sections={a}/>
                        </Col>
                        <Col lg={4}>
                            <Button onClick={() => this.setState({ showFilter: !this.state.showFilter })}>
                              Filter
                            </Button>
                            <Panel collapsible expanded={this.state.showFilter}>
                                <div>
                                    <ToggleButtonGroup
                                        name = "filterToggleGroup"
                                        type="radio"
                                        value={this.state.value}
                                        onToggleChange={this.onToggleChange}>
                                            <ToggleButton value={1}>Select Price</ToggleButton>
                                            <ToggleButton value={2} onClick={this.getCheapestTicketsAndSections.bind(this)} >Lowest Price</ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                                <span> </span>
                                <FormGroup controlId="formControlsEmail">
                                    <ReactSliderNativeBootstrap
                                        className="price-slider"
                                        max={1000}
                                        min={1}
                                        step={1}
                                        tooltip="hide"
                                        handleChange={this.firstComponentChangeValue.bind(this)}
                                        value={this.state.firstComponentCurrentValue}
                                    />

                                    <ControlLabel
                                        className="slider-price-label">
                                        Ticket Price: ${this.state.price}
                                    </ControlLabel>

                                    <div>
                                        <div2>
                                            <ControlLabel
                                                id="sectionNumber"
                                                style={{color: 'black', fontSize: 15}}>
                                                Section Number:
                                            </ControlLabel>
                                        </div2>
                                        <div2>
                                            <FormControl style={{width: 62}} placeholder="Enter section #"
                                                         type="section"
                                                         value={clickedSection}
                                                         onChange={this.handleChange.bind(this)}/>
                                        </div2>
                                    </div>

                                    <div>
                                        <Button bsStyle="primary"
                                                onClick={this.getTicketsWithFilter.bind(this)}>
                                            Apply
                                        </Button>
                                    </div>
                                </FormGroup>
                            </Panel>

                            <h3 className="Tickets-label"> Tickets </h3>
                            <div className="ticket-border">
                                {this.renderTicketList()}
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        </div>
        );
    }
}