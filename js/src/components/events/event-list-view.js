import React, { Component }  from 'react';
import EventListItem from './event-list-item';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

const games = [
{
    end: 'Tue Oct 17 2017 18:00:00 GMT-0400 (EDT)',
    start: 'Tue Oct 17 2017 21:00:00 GMT-0400 (EDT)',
    title: 'Sixers vs Grizzlies',
    homeTeam: '76ERS',
    awayTeam: 'GRIZZLIES',
    id: 1
},
{
    end: 'Fri Oct 20 2017 18:00:00 GMT-0400 (EDT)',
    start: 'Fri Oct 20 2017 21:00:00 GMT-0400 (EDT)',
    title: 'Sixers vs Cavaliers',
    homeTeam: '76ERS',
    awayTeam: 'CAVALIERS',
    id: 2
}
]

export default class EventListView extends Component {

	constructor(props) {
      super(props);

      this.state = {
        eventList: this.getEventList(),
        selectedID: null
      };
    }

    getEventList() {
    	return games;
    }

    getRedirect() {
    	return '/pick-tickets?event=' + this.state.selectedID;
    }

    onEventClick(e) {
    	this.setState({selectedID: e.target.id});
    }

    renderEventListItems() {
    	return _.map(this.state.eventList, (event, index) =>
            <ListGroupItem id={event.id} onClick={this.onEventClick.bind(this)}>
                <EventListItem event={event} />
            </ListGroupItem>
        );
    }

	render() {
		if (this.state.selectedID) {
			return <Redirect to={this.getRedirect()} />;
		}
		return (
            <div className="bgimg4">
                <div className="centered" style={{width: '40%', paddingTop: '75px'}}>
                    <h1> Choose Your Game </h1>
                    <ListGroup>
                        {this.renderEventListItems()}
                    </ListGroup>
                </div>
             </div>
		);
	}
}