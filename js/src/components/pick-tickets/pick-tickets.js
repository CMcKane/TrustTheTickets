import React, {Component} from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well,
        Button, Panel, ToggleButtonGroup, ToggleButton, ButtonGroup,
        DropdownButton, MenuItem} from 'react-bootstrap';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import ReactSliderNativeBootstrap from 'react-bootstrap-native-slider';
import TicketListItem from './ticket-list-item';
import queryString from 'query-string';
import { ClimbingBoxLoader } from 'react-spinners';
import {LinkContainer} from 'react-router-bootstrap';
import '../../stylesheet.css';

var clickedSection = ''

export default class PickTickets extends Component {

    constructor(props) {
        super(props);

        const queryParams = queryString.parse(this.props.location.search);

        this.state = {
            sections: [],
            tickets: [],
            ticketGroups: [],
            price: 0,
            showFilter: false,
            selectedEvent: null,
            eventID: queryParams.event,
            eventTitle: 'Choose a game',
            isLoading: false,
            previousSections: [],
            sliderValue: 0,
            toggleValue: 1,
            chartToggleValue: 1,
            bySection: true,
            groups: [],
            allZones: {
                        sectionTypeId: [1, 2, 3, 4, 5, 6, 7],
                        zone: [
                            ["112", "113", "114", "101", "102", "124"],
                            ["103", "111", "115", "123"],
                            ["104", "105", "109", "110", "116", "117", "121", "122"],
                            ["106", "107", "108", "118", "119", "120"],
                            ["201", "202", "203", "211", "212", "213", "214", "215", "223", "224"],
                            ["204", "204A", "205", "205A", "209", "209A", "210", "210A", "216", "216A", "217", "217A", "222A", "222", "221A", "221"],
                            ["206", "207", "207A", "208", "220", "219A", "219", "218"]]
                        },
            /*
            innerZone1: ["112", "113", "114", "101", "102", "124"],
            innerZone2: ["103", "111", "115", "123"],
            innerZone3: ["104", "105", "109", "110", "116", "117", "121", "122"],
            innerZone4: ["106", "107", "108", "118", "119", "120"],
            outerZone1: ["201", "202", "203", "211", "212", "213", "214", "215", "223", "224"],
            outerZone2: ["204", "204A", "205", "205A", "209", "209A", "210", "210A", "216", "216A",
                         "217", "217A", "222A", "222", "221A", "221"],
            outerZone3: ["206", "207", "207A", "208", "220", "219A", "219", "218"],
            noseBleeds: ["U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9", "U10", "U11", "U12", "U13",
                         "U14", "U15", "U16", "U17", "U18", "U19", "U20", "U21", "U22", "U23", "U24",
                         "U25", "U26"],
            suites: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
                     "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
                     "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43",
                     "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57",
                     "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71",
                     "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82"],
            clubBox1: ["CB2", "CB3", "CB4", "CB10", "CB11", "CB12", "CB14", "CB15", "CB16", "CB23", "CB24"],
            clubBox2: ["CC21", "CC20","CC19","CC18","CC17"],
            ground: ["R106", "R108", "R118", "R120"],
            letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"],
            special: ["SB1", "SB13"],
            private: ["PS22"] */
        }
        this.getEvent();
        this.displayAllTickets();
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    getEventTitle() {
        return this.state.selectedEvent.title;
    }

    getEvent() {
        TTTPost('/get-event', {
            eventID: this.state.eventID
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

    displayAllTickets() {
        this.setState({isLoading:true, tickets: [], toggleValue: 1});
        TTTPost('/all-tickets', {
            eventID: this.state.eventID
        })
            .then(res => {
                if (res.data.tickets) {
                    this.setState({
                        tickets: res.data.tickets,
                        isLoading: false
                    });
                }
            });
    }

    selectTicket() {
         this.setState({tickets: [], previousSections: [], sections: []});
         this.getTicketsWithFilter();
    }

    getTicketsWithFilter() {
        this.setState({isLoading:true, tickets: [], toggleValue: 1});
        if(this.state.sections.length === 0) {
            TTTPost('/get-cheap-ticket-any-section', {
                eventID: this.state.eventID,
                price: this.state.price
            })
            .then(res => {
                if (res.data.tickets) {
                    this.setState({
                        previousSections: this.state.sections,
                        sections: res.data.sections,
                        tickets: res.data.tickets,
                        isLoading: false
                    }, () => {this.createTicketGroupArrays(this.state.tickets)});
                }
            });
        } else {
            TTTPost('/pick-ticket-filter', {
                eventID: this.state.eventID,
                price: this.state.price,
                sections: this.state.sections
            })
                .then(res => {
                    if (res.data.tickets) {
                        this.setState({
                            tickets: res.data.tickets,
                            isLoading: false
                        }, () => {this.createTicketGroupArrays(this.state.tickets)});
                    }
                });
        }
    }

    getExpensiveTicketsAndSections() {
        this.setState({isLoading:true, tickets: []});
        TTTPost('/pick-expensive-ticket', {
            eventID: this.state.eventID
        })
            .then(res => {
                if (res.data.tickets) {
                    this.setState({
                        previousSections: this.state.sections,
                        sections: res.data.sections,
                        tickets: res.data.tickets,
                        isLoading: false
                    }, () => {this.createTicketGroupArrays(this.state.tickets)});
                }
            });
    }

    getCheapestTickets() {
        this.setState({isLoading:true, tickets: []});        
        TTTPost('/pick-cheapest-ticket',{
            eventID: this.state.eventID            
        })
            .then(res => {
                if (res.data.tickets) {
                    this.setState({
                        tickets: res.data.tickets,
                        previousSections: this.state.sections,
                        sections: res.data.sections,
                        isLoading: false
                    }, () => {this.createTicketGroupArrays(this.state.tickets)});
                }
            });
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

    onChartClick(section) {
        if(this.state.bySection)
        {
            if(this.state.sections.length === 1 && this.state.sections[0] === section) {
                this.setState({
                    previousSections: this.state.sections,
                    sections: [],
                    tickets: [],
                    toggleValue: 1
                }, () => {this.createTicketGroupArrays(this.state.tickets)});
            }
            else {
                this.setState({isLoading:true, tickets: []});
                TTTPost('/tickets', {
                    eventID: this.state.eventID,
                    section_number: section
                })
                    .then(res => {
                        if (res.data.tickets) {
                            this.setState({
                                previousSections: this.state.sections,
                                sections: [section],
                                tickets: res.data.tickets,
                                isLoading: false,
                                toggleValue: 1
                            }, () => {this.createTicketGroupArrays(this.state.tickets)});
                        }
                    });
            }
        }
        else
        {
            var sectionsAndZone = this.determineSectionsZone(section);
            this.setState({isLoading:true, tickets: []});

            TTTPost('/pick-ticket-zone', {
                    eventID: this.state.eventID,
                    section_type_id: sectionsAndZone.zone
                })
                    .then(res => {
                        if (res.data.tickets) {
                            this.setState({
                                previousSections: this.state.sections,
                                sections: sectionsAndZone.sections,
                                tickets: res.data.tickets,
                                isLoading: false,
                                toggleValue: 1
                            }, () => {this.createTicketGroupArrays(this.state.tickets)});
                        }
                    });
        }

    }

    createTicketGroupArrays(tickets) {
        var groups;
        TTTPost('/create-groups', {
                    tickets: tickets
                })
                    .then(res => {
                        if (res.data.groups) {
                            this.setState({groups: res.data.groups});
                        }
                    });
        console.log(this.state.groups);
    }

    determineSectionsZone(section) {

        var firstChar = section.charAt(0);
        var len = section.length;

        if(firstChar === '1' && len > 2)
        {
            for(var i = 0; i < this.state.allZones.zone[0].length; i++)
                if(section === this.state.allZones.zone[0][i]) { return {sections: this.state.allZones.zone[0], zone: 1} }
            for(var i = 0; i < this.state.allZones.zone[1].length; i++)
                if(section === this.state.allZones.zone[1][i]) { return {sections: this.state.allZones.zone[1], zone: 2} }
            for(var i = 0; i < this.state.allZones.zone[2].length; i++)
                if(section === this.state.allZones.zone[2][i]) { return {sections: this.state.allZones.zone[2], zone: 3} }
            for(var i = 0; i < this.state.allZones.zone[3].length; i++)
                if(section === this.state.allZones.zone[3][i]) { return {sections: this.state.allZones.zone[3], zone: 4} }

        }
        else if(firstChar === '2' && len > 2)
        {
            for(var i = 0; i < this.state.allZones.zone[4].length; i++)
                if(section === this.state.allZones.zone[4][i]) { return {sections: this.state.allZones.zone[4], zone: 5} }
            for(var i = 0; i < this.state.allZones.zone[5].length; i++)
                if(section === this.state.allZones.zone[5][i]) { return {sections: this.state.allZones.zone[5], zone: 6} }
            for(var i = 0; i < this.state.allZones.zone[6].length; i++)
                if(section === this.state.allZones.zone[6][i]) { return {sections: this.state.allZones.zone[6], zone: 7} }
        }
        /*else if(firstChar === 'U')
        {
            return this.state.noseBleeds;
        }
        else if(len === 2)
        {
            return this.state.suites;
        }
        else if(firstChar === 'C')
        {
            if(section.charAt(1) === 'C') {
                return this.state.clubBox2;
            }
            else {
                return this.state.clubBox1;
            }

        }
        else if(firstChar === 'S')
        {
            return this.state.special;
        }
        else if(firstChar === 'P')
        {
            return this.state.private;
        }
        else if(len === 1 && section.match(/[A-R]/i))
        {
            return this.state.letter;
        }
        else if(firstChar === 'R')
        {
            return this.state.ground;
        }*/
        else
        {
            return [];
        }
    }

    onSliderChange(e) {
        this.setState({
            sliderValue: e.target.value,
            price: e.target.value
        });
    }

    onToggleChange(value) {
        this.setState({ toggleValue: value });
    }

    hasEventID() {
        if (this.state.eventID > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    eventButtonClick() {
        return <LinkContainer to='/event-calendar'/>;
    }

    toggleSectionOrZone() {
        if(this.state.bySection) {
            this.setState({bySection: false, chartToggleValue: 2});
        }
        else {
            this.setState({bySection: true, chartToggleValue: 1});
        }
    }

    //render the values in the tickets
    renderTicketList() {
        var list = [];
        for(var group in this.state.groups)
        {
            var seats = []
            for(var i = 0; i < this.state.groups[group].length; i++) {
                seats.push(this.state.groups[group][i].seat_number);
            }
            seats.sort();
            list.push(
                <li className="list-group-item" border-color="red">
                    Tickets for sale: {this.state.groups[group].length}
                    <br></br>
                    <li> Section: {this.state.groups[group][0].section_number}</li>
                    <li>Row: {this.state.groups[group][0].row_number}</li>
                    <li>Seat(s): {seats.join(", ")}</li>
                    <li>Price: ${this.state.groups[group][0].ticket_price} /ea</li>
                    <br></br>
                    <Button className="buy-button" bsSize="xsmall">Buy</Button>
                </li>
            )
        }
        return(list)
    }

    render() {
        return (
            <div className="globalImage pickTicketsBgImage">
                <div className="globalImageOverlay">
                    <Grid style={{paddingTop: "25px"}}>
                        <h1>
                            <Well className='pickTicketsWell'>
                                Pick-A-Ticket
                            </Well>
                        </h1>
                        <Row>
                            <Col lg={8}>
                                <Row>
                                    <Col lg={8}>
                                        <ButtonGroup>
                                            <DropdownButton disabled={this.hasEventID()}
                                                title={this.state.eventTitle} id="bg-nested-dropdown">
                                                <LinkContainer to='/event-calendar'>
                                                    <MenuItem eventKey="By Team">By Team</MenuItem>
                                                </LinkContainer>
                                                <LinkContainer to='/event-calendar'>
                                                    <MenuItem eventKey="By Calendar">By Calendar</MenuItem>
                                                </LinkContainer>
                                            </DropdownButton>
                                        </ButtonGroup>
                                        <div>
                                            <ToggleButtonGroup style={{width: '40%', paddingTop: '15px'}}
                                                id = "chartToggleGroup"
                                                name = "chartToggleGroup"
                                                type="radio"
                                                value={this.state.chartToggleValue}
                                                bsSize="small"
                                                onChange={this.toggleSectionOrZone.bind(this)}>
                                                    <ToggleButton id="section" style={{width: '40%'}} value={1}>Section</ToggleButton>
                                                    <ToggleButton id="zone" style={{width: '40%'}} value={2}>Zone</ToggleButton>
                                            </ToggleButtonGroup>
                                        </div>
                                    </Col>
                                </Row>
                                <br/>
                                <WellsFargoChart
                                    onSectionSelected={this.onChartClick.bind(this)}
                                    selectedSections={this.state.sections}
                                    previousSections={this.state.previousSections}/>
                            </Col>
                            <Col lg={4}>
                                <Button onClick={() => this.setState({ showFilter: !this.state.showFilter })}>
                                  Filter
                                </Button>
                                <Panel collapsible expanded={this.state.showFilter}>
                                    <div>
                                        <ToggleButtonGroup
                                            id = "priceToggleGroup"
                                            name = "filterToggleGroup"
                                            style={{paddingBottom: '5px'}}
                                            type="radio"
                                            value={this.state.toggleValue}
                                            onChange={this.onToggleChange.bind(this)}>
                                                <ToggleButton id="selectPrice" value={1} onClick={this.selectTicket.bind(this)}>Select Price</ToggleButton>
                                                <ToggleButton id="lowestPrice" value={2} onClick={this.getCheapestTickets.bind(this)} >Lowest Price</ToggleButton>
                                                <ToggleButton id="highestPrice" value={3} onClick={this.getExpensiveTicketsAndSections.bind(this)} >Highest Price</ToggleButton>
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
                                            handleChange={this.onSliderChange.bind(this)}
                                            value={this.state.sliderValue}/>

                                        <ControlLabel
                                            className="slider-price-label">
                                            Ticket Price: ${this.state.price}
                                        </ControlLabel>

                                        <div>

                                            <Button bsStyle="primary"
                                                    onClick={this.getTicketsWithFilter.bind(this)}>
                                                Apply
                                            </Button>

                                        </div>

                                    </FormGroup>
                                </Panel>

                                <h3 className="Tickets-label"> Tickets </h3>
                                <div className="ticketListItemTicketBorder">
                                    {this.renderTicketList()}
                                    <div align="center"> <ClimbingBoxLoader loading={this.state.isLoading}/> </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}