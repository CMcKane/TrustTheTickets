import React, {Component} from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well,
        Button, ButtonToolbar, Panel, ToggleButtonGroup, ToggleButton, ButtonGroup,
        DropdownButton, MenuItem, Modal} from 'react-bootstrap';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import TicketListItem from './ticket-list-item';
import queryString from 'query-string';
import { ClimbingBoxLoader, RiseLoader, PulseLoader } from 'react-spinners';
import {LinkContainer} from 'react-router-bootstrap';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import PickTicketsModal from './pick-tickets-modal';
import { Redirect } from 'react-router-dom';
import Checkout from './checkout';
import withAuth from '../auth/with-auth';
import { withRouter } from 'react-router';

var clickedSection = ''
var taxRate = 0;
var commRate = 0;
var groupz = [];
export default class PickTickets extends Component {

    constructor(props) {
        super(props);

        const queryParams = queryString.parse(this.props.location.search);

        this.state = {
            sections: [],
            tickets: [],
            minPrice: 0,
            maxPrice: 100,
            desiredNumberTickets: 0,
            showFilter: true,
            selectedEvent: null,
            eventID: queryParams.event,
            eventTitle: 'Choose a game',
            isLoading: false,
            previousSections: [],
            toggleValue: 4,
            chartToggleValue: 1,
            filterChanged: false,
            bySection: true,
            groups: [],
            show: false,
            modalSubmitError: null,
            selectedGroup: null,
            currGroups: [],
            aisleSeatToggle: 0,
            handicapToggle: 0,
            earlyAccessToggle: 0,
            activeCheckBoxes: [],
            checkoutTickets: [],
            checkoutPageActive: false,
            commissionPercent: 0,
            taxPercent: 0,
            ticketNumStr: "Number of Tickets",
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
            validSections: ["112", "113", "114", "101", "102", "124", "103", "111", "115", "123", "104", "105", "109", "110", "116", "117", "121", "122",
            "106", "107", "108", "118", "119", "120", "201", "202", "203", "211", "212", "213", "214", "215", "223", "224", "204", "204A", "205", "205A",
            "209", "209A", "210", "210A", "216", "216A", "217", "217A", "222A", "222", "221A", "221", "206", "207", "207A", "208", "220", "219A", "219", "218"]
        }
        this.fetchFees();
    }

    // this method gets called when the component initially gets rendered,
    // and handles the initial appearence of the pick ticket chart
    // by default it called the get cheapest tickets routine
    componentDidMount() {
        this.getEvent();
        this.handleQuickSearchButtonPress("firstload");
    }

    onHide() {
		this.setState({
			show: false
		});
	}

	showModal(listing) {
		this.setState({
			selectedListing: listing,
			show: true
		})
	}

    setDesiredNumberTickets(eventKey) {

        var newTicketNumStr = "Number of Tickets";
        switch(eventKey)
        {
            case "1":
                newTicketNumStr = "1 Ticket";
                break;
            case "2":
                newTicketNumStr = "2 Tickets";
                break;
            case "3":
                newTicketNumStr = "3 Tickets";
                break;
            case "4":
                newTicketNumStr = "4 Tickets";
                break;
            case "5":
                newTicketNumStr = "5 Tickets";
                break;
            case "6":
                newTicketNumStr = "6 Tickets";
                break;
            case "7":
                newTicketNumStr = "7 Tickets";
                break;
            case "8":
                newTicketNumStr = "8 Tickets";
                break;
            case "9":
                newTicketNumStr = "9 Tickets";
                break;
            case "10":
                newTicketNumStr = "10+ Tickets";
                break;
            default:
                break;

        }
        this.setState({
            desiredNumberTickets: eventKey,
            ticketNumStr: newTicketNumStr
        });
    }

    fetchFees() {
        TTTGet("/get-fees")
            .then(res => {
                this.setState({
                    commissionPercent: res.data.percentages[1][0],
                    taxPercent: res.data.percentages[2][0]
                }, () => {this.getRates(this.state.taxPercent, this.state.commissionPercent)});
            });
    }

    getRates(taxPercent, commissionPercent) {
        this.taxRate = taxPercent;
        this.commissionPercent = commissionPercent;
        var arr = []
        arr.push(taxRate);
        arr.push(commissionPercent);
        return (arr);
    }

    // get event is called to populate the pick tickets chart with event related information
    // it gets called when the chart is initally rendered for a particular event
    // get event retrieves the title of the currently loaded event.
    getEvent() {
        TTTPost('/get-event', {
            eventID: this.state.eventID
        })
        .then(res => {
            try {
                if (res.data.event.authenticated) {
                    this.setState({
                        eventTitle: res.data.event.title
                    });
                }
            }
            catch (e) {
                console.log(e);
            }

        });
    }

    handleQuickSearchButtonPress(e)
    {
        // some nonsense to see if i'm calling this directly from first load
        ////////////////////////////////////////////////////////////////////
        var firstload = 0;
        try{if(e == "firstload"){firstload = 2;}}
        catch(e){}
        // if I do call it from first load, i set firstload == 2 and proceed
        ////////////////////////////////////////////////////////////////////
        if((firstload == 2) || !(e.target.value === undefined))
        {
            this.setState({
                isLoading: true,
                tickets: [],
                groups: [],
                toggleValue: 4
            });

            // if firstload is set, then use code 2 which is search lowest
            var priceMode = (firstload == 2) ? 2 : parseInt(e.target.value);

            // we will always pass a range on,
            // but whether we use it depends on the priceMode
            TTTPost('/get-tickets-and-sections-by-price',{
                eventID: this.state.eventID,
                aisleSeat: this.state.aisleSeatToggle,
                earlyAccess: this.state.earlyAccessToggle,
                handicap: this.state.handicapToggle,
                desiredNumberTickets: this.state.desiredNumberTickets,
                priceMode: priceMode,
                priceRange: {
                    min: this.state.minPrice,
                    max: this.state.maxPrice
                }
            })
                .then(res => {
                    if(res.data.tickets){
                        this.setState({
                            tickets: res.data.tickets,
                            previousSections: this.state.sections,
                            sections: res.data.sections,
                            isLoading: false
                        }, () => {this.createTicketGroupArrays(this.state.tickets)})
                    }
                    else{
                        this.setState({
                            isLoading: false
                        });
                    }
                })
        }
    }

    handleToggleButtonPress(e)
    {
        if(!(e.target.value === undefined))
        {
            switch(e.target.value)
            {
                // price range case
                case 1:
                    this.setState({
                        toggleValue: 1
                    });
                    break;
                // any price case
                case 4:
                    this.setState({
                        toggleValue: 4
                    });
                    break;
            }
        }
    }

    // performs a full search in all sections from the database,
    // with the filters that are currently set
    searchForTicketsWithFilter() {
        this.setState({
            isLoading: true,
            tickets: [],
            groups: [],
            previousSections: this.state.sections,
            sections: []
        });
        TTTPost('/search-tickets-with-filter', {
            eventID: this.state.eventID,
            minPrice: this.getMinPriceBasedOnToggle(),
            maxPrice: this.getMaxPriceBasedOnToggle(),
            earlyAccess: this.state.earlyAccessToggle,
            aisleSeat: this.state.aisleSeatToggle,
            handicap: this.state.handicapToggle,
            desiredNumberTickets: this.state.desiredNumberTickets
        })
            .then(res => {
                if (res.data.tickets) {
                    this.setState({
                        previousSections: this.state.sections,
                        sections: res.data.sections,
                        tickets: res.data.tickets,
                        isLoading: false
                    }, () => {
                        this.createTicketGroupArrays(this.state.tickets)
                    });
                }
            });
    }

    // Retrieves tickets that match the current filter.
    // Does not load new sections, only populates the ticket panel
    // with tickets from the current sections that match the filter
    applyFilter()
    {
        if (this.state.sections.length === 0)
        {
            this.searchForTicketsWithFilter();
        }
        else
        {
            this.setState({
                isLoading: true,
                tickets: [],
                groups: []
            });

            TTTPost('/search-tickets-in-sections-with-filter', {
                eventID: this.state.eventID,
                sections: this.state.sections,
                minPrice: this.getMinPriceBasedOnToggle(),
                maxPrice: this.getMaxPriceBasedOnToggle(),
                earlyAccess: this.state.earlyAccessToggle,
                aisleSeat: this.state.aisleSeatToggle,
                handicap: this.state.handicapToggle,
                desiredNumberTickets: this.state.desiredNumberTickets
            })
                .then(res => {
                    if (res.data.tickets) {
                        this.setState({
                            tickets: res.data.tickets,
                            isLoading: false
                        }, () => {
                            this.createTicketGroupArrays(this.state.tickets)
                        });
                    }
                });
        }
        console.log(this.state.tickets);
        console.log(this.state.groups);
    }

    validSection(section) {
        var valid = false;
        for(var i = 0; i < this.state.validSections.length; i++) {
            if(this.state.validSections[i] === section) {
                valid = true;
            }
        }
        return (valid);
    }

    onChartClick(section) {
        if(this.validSection(section)) {
            // if we are picking by section
            if(this.state.bySection)
            {
                // If you are clicking on a currently selected section
                // deselect that section, and empty the ticket list
                if(this.state.sections.length === 1 && this.state.sections[0] === section && !this.state.filterChanged)
                {
                    this.setState({
                        previousSections: this.state.sections,
                        sections: [],
                        tickets: []
                    }, () => {this.renderTicketList()});
                }
                // else you're clicking on a new section, get the tickets for it
                else
                {
                    if(this.state.filterChanged)
                    {
                       this.setState({filterChanged: false})
                    }
                    this.setState({isLoading:true, tickets: []});
                    TTTPost('/search-tickets-in-sections-with-filter', {
                        eventID: this.state.eventID,
                        sections: [section],
                        minPrice: this.getMinPriceBasedOnToggle(),
                        maxPrice: this.getMaxPriceBasedOnToggle(),
                        aisleSeat: this.state.aisleSeatToggle,
                        earlyAccess: this.state.earlyAccessToggle,
                        handicap: this.state.handicapToggle,
                        desiredNumberTickets: this.state.desiredNumberTickets
                    })
                        .then(res => {
                            if (res.data.tickets) {
                                this.setState({
                                    previousSections: this.state.sections,
                                    sections: [section],
                                    tickets: res.data.tickets,
                                    isLoading: false
                                }, () => {this.createTicketGroupArrays(this.state.tickets)});
                            }
                        });
                }
            }
            // else we are picking by zone
            else
            {
                var sectionsAndZone = this.determineSectionsZone(section);
                this.setState({isLoading:true, tickets: []});

                TTTPost('/search-tickets-in-zone-with-filter', {
                        eventID: this.state.eventID,
                        section_type_id: sectionsAndZone.zone,
                        minPrice: this.getMinPriceBasedOnToggle(),
                        maxPrice: this.getMaxPriceBasedOnToggle(),
                        aisleSeat: this.state.aisleSeatToggle,
                        earlyAccess: this.state.earlyAccessToggle,
                        handicap: this.state.handicapToggle,
                        desiredNumberTickets: this.state.desiredNumberTickets
                    })
                        .then(res => {
                            if (res.data.tickets) {
                                this.setState({
                                    previousSections: this.state.sections,
                                    sections: sectionsAndZone.sections,
                                    tickets: res.data.tickets,
                                    isLoading: false
                                }, () => {this.createTicketGroupArrays(this.state.tickets)});
                            }
                        });
            }
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
    }

    getMinPriceBasedOnToggle()
    {
        return (this.state.toggleValue == 1) ? this.state.minPrice : 0;
    }

    getMaxPriceBasedOnToggle()
    {
        return (this.state.toggleValue == 1) ? this.state.maxPrice : 999999;
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
        else
        {
            return [];
        }
    }

    onRangeSliderChange(value) {
        this.setState({
            minPrice: value[0],
            maxPrice: value[1],
            filterChanged: true,
            toggleValue: 1
        });
    }

    onToggleChange(value) {
        this.setState({
            toggleValue: value,
            filterChanged: true
        });
    }

    toggleSectionOrZone() {
        if(this.state.bySection) {
            this.setState({bySection: false, chartToggleValue: 2});
        }
        else {
            this.setState({bySection: true, chartToggleValue: 1});
        }
    }

    createModal(e) {
        var group = this.state.currGroups[e.target.id];

        TTTPost('/get-tickets-for-group', {
                    group_id: group[0].group_id
                })
                    .then(res => {
                        if (res.data.tickets) {
                            this.setState({
                                show: !this.state.show,
                                selectedGroup: res.data.tickets
                             });
                        }
                    });
    }

    clearResults() {
        this.setState({
            previousSections: this.state.sections,
            groups: [],
            sections: [],
            tickets: []
        });
    }

    toggleFilter(e) {
        var changingToState;
        if(this.state[e.target.id] === 1) {
            changingToState = 0;
        } else {
            changingToState = 1;
        }
        this.setState({
            [e.target.id]: changingToState,
            filterChanged: true
        });
    }

    addCheckBox(value) {
        this.setState({activeCheckBoxes: value});
    }

    returnFromCheckout() {
        this.setState({
            checkoutPageActive: false, 
            previousSections: this.state.sections,
            sections: [],
            checkoutTickets: [],
            tickets: [],
            groups: []
        }, () => {this.handleQuickSearchButtonPress("firstload")});
    }

    setCheckoutTickets(tickets) {
        // Call backend to see if these tickets are all still available first
        this.setState({
            checkoutTickets: tickets,
            show: false,
            checkoutPageActive: true
        });
    }

    renderEmptyTicketList() {
        var list = [];
        var output = "Click a section to find tickets.";

        if(this.state.sections.length > 0) {
            output = "No tickets listed in this section."
        }

        list.push(
            <div className="emptyTicketBorder">
                <p className="emptyTicketPanel"> {output} </p>
            </div>
        );

        return list;
    }

    //render the values in the tickets
    renderTicketList() {
        var list = [];
        if(this.state.tickets.length === 0)
        {
            list = this.renderEmptyTicketList();
        }
        else
        {
            var counter = 1;
            for(var group in this.state.groups)
            {
                var id = "";
                var seats = [];
                for(var i = 0; i < this.state.groups[group].length; i++) {
                    seats.push(parseInt(this.state.groups[group][i].seat_number));
                }

                // By default js .sort method sorts lexigraphically, this function overrides
                // that to sort it numerically.
                function sortNumber(a,b) {
                    return a - b;
                }

                seats.sort(sortNumber);
                list.push(

                    <div key={group} className="ticketBorder">
                        <table className="ticketTableHeader">
                            <tr>
                                <td>
                                    {this.state.groups[group].length} {this.state.groups[group].length > 1 ? 'Tickets' : 'Ticket'}
                                </td>
                            </tr>
                        </table>
                        <table className="ticketTableBody">
                            <tr className="ticketTableBodyHeader">
                                <td>Section</td>
                                <td>Row</td>
                                <td>{this.state.groups[group].length > 1 ? 'Seats' : 'Seat'}</td>
                                <td>Price</td>
                            </tr>
                            <tr className="ticketTableBodyBody">
                                <td>{this.state.groups[group][0].section_number}</td>
                                <td>{this.state.groups[group][0].row_number}</td>
                                <td>{seats.join(", ")}</td>
                                <td>${this.state.groups[group][0].ticket_price} /ea</td>
                            </tr>
                        </table>
                        <table className="ticketTableFooter">
                            <tr>
                                <td>
                                    {/* ticket attributes here */}
                                </td>
                                <td>
                                    <Button
                                        id={counter}
                                        style={{marginLeft: "100px", marginTop: "10px", color: "black"}}
                                        bsSize="xsmall" onClick={this.createModal.bind(this)} >See Tickets
                                    </Button>
                                </td>
                            </tr>
                        </table>
                    </div>
                )
                this.state.currGroups[counter] = this.state.groups[group];
                counter = counter + 1;
            }
        }
        return(list)
    }

    handleCheckoutRefresh() {
        this.setState({checkoutPageActive : true});
    }

    render() {
            if(this.state.checkoutPageActive)
            {
                return (
                    <Checkout
                        checkoutTickets={this.state.checkoutTickets}
                        commissionPercent={this.state.commissionPercent}
                        taxPercent={this.state.taxPercent}
                        returnFromCheckout={this.returnFromCheckout.bind(this)}
                        eventID={this.state.eventID}
                        handleCheckoutRefresh={this.handleCheckoutRefresh.bind(this)}/>
                );
            }
            else
            {
                const AuthPickTicketsModal = withAuth(PickTicketsModal);
                return (

                    <div className=" globalBody globalImage">

                         <AuthPickTicketsModal
                            returnRedirect={"/pick-tickets?event=" + this.state.eventID}
                            modalSubmitError={this.state.modalSubmitError}
                            show={this.state.show}
                            onHide={this.onHide.bind(this)}
                            group={this.state.selectedGroup}
                            setCheckoutTickets={this.setCheckoutTickets.bind(this)} />
                        <div className=" globalBody globalImageOverlay">
                            <Well className='eventCalendarViewEventsWell'>
                                Choose Your Seats
                            </Well>
                            <Grid>
                                <Row>
                                    <h2 className='text-center'>{this.state.eventTitle}</h2>
                                    <Col xs={12} sm={12} md={7} lg={7}>
                                        <Row>
                                            <Col xs={12} sm={12} md={8} lg={8}>
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
                                            <Col xs={12} sm={12} md={8} lg={8}>
                                                <ButtonGroup style={{width: '40%'}}>
                                                    <DropdownButton bsSize='small'
                                                        title={this.state.ticketNumStr} id="bg-nested-dropdown">
                                                        <MenuItem eventKey="0" onSelect={this.setDesiredNumberTickets.bind(this)}>Any</MenuItem>
                                                        <MenuItem eventKey="1" onSelect={this.setDesiredNumberTickets.bind(this)}>1 Ticket</MenuItem>
                                                        <MenuItem eventKey="2" onSelect={this.setDesiredNumberTickets.bind(this)}>2 Tickets</MenuItem>
                                                        <MenuItem eventKey="3" onSelect={this.setDesiredNumberTickets.bind(this)}>3 Tickets</MenuItem>
                                                        <MenuItem eventKey="4" onSelect={this.setDesiredNumberTickets.bind(this)}>4 Tickets</MenuItem>
                                                        <MenuItem eventKey="5" onSelect={this.setDesiredNumberTickets.bind(this)}>5 Tickets</MenuItem>
                                                        <MenuItem eventKey="6" onSelect={this.setDesiredNumberTickets.bind(this)}>6 Tickets</MenuItem>
                                                        <MenuItem eventKey="7" onSelect={this.setDesiredNumberTickets.bind(this)}>7 Tickets</MenuItem>
                                                        <MenuItem eventKey="8" onSelect={this.setDesiredNumberTickets.bind(this)}>8 Tickets</MenuItem>
                                                        <MenuItem eventKey="9" onSelect={this.setDesiredNumberTickets.bind(this)}>9 Tickets</MenuItem>
                                                        <MenuItem eventKey="10" onSelect={this.setDesiredNumberTickets.bind(this)}>10+ Tickets</MenuItem>
                                                    </DropdownButton>
                                                </ButtonGroup>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <WellsFargoChart
                                            allZones={this.state.allZones}
                                            onSectionSelected={this.onChartClick.bind(this)}
                                            selectedSections={this.state.sections}
                                            previousSections={this.state.previousSections}/>
                                    </Col>
                                    <Col xs={12} sm={12} md={5} lg={5}>
                                        <Grid style={{paddingLeft: "0px", paddingTop: "10%"}}>
                                        <Col xs={1} sm={2} md={1} lg={1}>
                                        </Col>
                                        <Col xs={10} sm={8} md={3} lg={3} style={{padding: "0px"}}>
                                        <Button onClick={() => this.setState({ showFilter: !this.state.showFilter })}>
                                          Search Options
                                        </Button>
                                        <Panel collapsible expanded={this.state.showFilter} style={{backgroundColor: '#F8F8F8'}}>
                                            <div>
                                                <ControlLabel>
                                                    Quick Searches:
                                                </ControlLabel>
                                                <ButtonToolbar id="QuickSearchesButtonToolbar">
                                                    <ButtonGroup block vertical>

                                                        <Button id="lowestPrice" value={2} name="lowest" onClick={this.handleQuickSearchButtonPress.bind(this)}>Lowest Price</Button>

                                                        <Button id="highestPrice" value={3} name="highest" onClick={this.handleQuickSearchButtonPress.bind(this)}>Highest Price</Button>

                                                    </ButtonGroup>
                                                </ButtonToolbar>
                                            </div>
                                            <hr className="filter-hr"/>
                                            <div>
                                                <ControlLabel>
                                                    Price Filter:
                                                </ControlLabel>
                                                <div>
                                                    <ToggleButtonGroup
                                                        id = "priceToggleGroup"
                                                        name = "filterToggleGroup"
                                                        style={{paddingTop: '5px'}}
                                                        type="radio"
                                                        value={this.state.toggleValue}
                                                        onChange={this.onToggleChange.bind(this)}>
                                                        <ToggleButton bsStyle="success" id="selectPrice" value={1} name="select" onClick={this.handleToggleButtonPress.bind(this)}>Use Range</ToggleButton>
                                                        <ToggleButton id="anyPrice" value={4} name="any" onClick={this.handleToggleButtonPress.bind(this)}>Any Price</ToggleButton>
                                                    </ToggleButtonGroup>
                                                </div>
                                                <Range
                                                    className="range-slider"
                                                    style={{paddingTop: "15px", paddingBottom: "15px"}}
                                                    max={1000}
                                                    min={0}
                                                    step={5}
                                                    defaultValue={[0, 100]}
                                                    onChange={this.onRangeSliderChange.bind(this)} />
                                                <ControlLabel
                                                    className="slider-price-label">
                                                    Price Range: ${this.state.minPrice} - ${this.state.maxPrice}
                                                </ControlLabel>
                                            </div>
                                            <hr className="filter-hr"/>
                                            <div>
                                                <ControlLabel>
                                                    Extras Filter:
                                                </ControlLabel>
                                                <div>
                                                    <ToggleButtonGroup
                                                        id="checkBoxes"
                                                        style={{paddingTop: '5px'}}
                                                        type="checkbox"
                                                        value={this.state.activeCheckBoxes}
                                                        onChange={this.addCheckBox.bind(this)}>
                                                            <ToggleButton id="handicapToggle" value={1} onClick={this.toggleFilter.bind(this)}>Handicap</ToggleButton>
                                                            <ToggleButton id="aisleSeatToggle" value={2} onClick={this.toggleFilter.bind(this)}>Aisle</ToggleButton>
                                                            <ToggleButton id="earlyAccessToggle" value={3} onClick={this.toggleFilter.bind(this)}>Early Entry</ToggleButton>
                                                    </ToggleButtonGroup>
                                                </div>
                                            </div>
                                            <hr className="filter-hr"/>
                                            <div>
                                                <FormGroup controlId="formControlsEmail">
                                                    <ButtonToolbar>
                                                        <Button style={{marginRight: "5px"}} bsStyle="danger" onClick={this.clearResults.bind(this)}>Clear</Button>
                                                        <Button style={{marginRight: "5px"}} bsStyle="primary" onClick={this.applyFilter.bind(this)}>Apply</Button>
                                                        <Button bsStyle="primary" onClick={this.searchForTicketsWithFilter.bind(this)}>Search</Button>
                                                    </ButtonToolbar>
                                                </FormGroup>
                                            </div>
                                        </Panel>

                                        <h3 className="ticketsLabel"> Tickets </h3>
                                        <div className="ticketListItemTicketBorder">
                                            {this.renderTicketList()}
                                            <div style={{align:"center"}}> <PulseLoader loading={this.state.isLoading}/> </div>
                                        </div>
                                        </Col>
                                        <Col xs={1} sm={2} md={1} lg={1}>
                                        </Col>
                                        </Grid>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                    </div>
                );
            }
    }
}