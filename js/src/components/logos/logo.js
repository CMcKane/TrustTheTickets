import React, {Component} from 'react';
import {Image} from 'react-bootstrap';
import {getLogo} from "./logo-central";

export default class Logo extends Component {

    render() {
        var teamName = this.props.team;
        if (this.props.team === "76ers") teamName = "Sixers";
        return (<Image className="teamLogo"
                       src={getLogo(teamName)} responsive/>);
    }
}