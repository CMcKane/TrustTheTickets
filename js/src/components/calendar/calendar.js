import React, { Component }  from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import EventComponent from './event-component';
import style from 'react-big-calendar/lib/css/react-big-calendar.css';

// Honestly don't know why/if we need this
BigCalendar.momentLocalizer(moment);

export default class EventCalendar extends Component {

    eventSelected(e) {
        this.props.eventSelected(e);
    }

    navigate(date, view) {
        this.props.onNavigate(date, view);
    }

    getDate() {;
        if (this.props.validateDate(this.props.month, this.props.year)) {
            var d = new Date();
            d.setMonth(this.props.month, 1);
            d.setFullYear(this.props.year);
            return d;
        }
        return new Date();
    }

    render() {
        return (
            <BigCalendar
                style={style}
                events={this.props.events}
                views={['month']}
                components={{
                    event: EventComponent
                }}
                date={this.getDate()}
                onSelectEvent={this.eventSelected.bind(this)}
                selected={this.props.selected}
                onNavigate={this.navigate.bind(this)} />
        )
    }
}
