import React, { Component }  from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import EventComponent from './event-component';
import style from 'react-big-calendar/lib/css/react-big-calendar.css';

// Honestly don't know why/if we need this
BigCalendar.momentLocalizer(moment);

/**
* This class is used to render the actual event calender used on the web page.
*/
export default class EventCalendar extends Component {

    /**
    * Handle when user clicks on an event.
    */
    eventSelected(e) {
        this.props.eventSelected(e);
    }

    /**
    * Handle the navigation on the calender, such as switching months.
    * @param date - the current date.
    * @param view - the current view.
    */
    navigate(date, view) {
        this.props.onNavigate(date, view);
    }

    /**
    * Creates a new date with the current date.
    */
    getDate() {;
        if (this.props.validateDate(this.props.month, this.props.year)) {
            var d = new Date();
            d.setMonth(this.props.month, 1);
            d.setFullYear(this.props.year);
            return d;
        }
        return new Date();
    }

    /**
    * Retrieves the event styles.
    */
    getEventStyle() {
        var style = {
            backgroundColor: 'white',
            display: 'block',
        };
        return {
            style: style
        }
    }

    /**
    * Main rendering loop.
    */
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
                onNavigate={this.navigate.bind(this)}
                eventPropGetter={this.getEventStyle.bind(this)}/>
        )
    }
}
