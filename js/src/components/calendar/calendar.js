import React, { Component }  from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

//Set the localizer for big calendar to moment
BigCalendar.momentLocalizer(moment);

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

let Basic = React.createClass({
     render() {
        return (
            <BigCalendar
                {...this.props}
                events={}
                views={allViews}
                step={60}
                defaultDate={new Date()}
            />
        )
    }
})