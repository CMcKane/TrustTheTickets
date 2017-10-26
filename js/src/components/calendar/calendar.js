import React, { Component }  from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import EventComponent from './event-component';
import style from 'react-big-calendar/lib/css/react-big-calendar.css';

// Honestly don't know why/if we need this
BigCalendar.momentLocalizer(moment);

export default class EventCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: this.props.events
        };
    }

    eventSelected(e) {
        this.props.eventSelected(e);
    }

    navigate(date, view) {
        this.props.onNavigate(date, view);
    }

    render() {
        return (
            <BigCalendar
                style={style}
                events={this.state.events}
                views={['month']}
                components={{
                    event: EventComponent
                }}
                onSelectEvent={this.eventSelected.bind(this)}
                selected={this.props.selected}
                onNavigate={this.navigate.bind(this)} />
        )
    }
}