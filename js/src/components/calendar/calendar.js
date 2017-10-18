import React, { Component }  from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
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

    render() {
        return (
            <BigCalendar
                style={style}
                events={this.state.events}
                views={['month']}
                />
        )
    }
}