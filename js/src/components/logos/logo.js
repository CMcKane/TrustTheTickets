import React, {Component} from 'react';
import { Image } from 'react-bootstrap';
import { getLogo } from "./logo-central";
import "./logo.css";

export default class Logo extends Component {

	render() {
		var teamName = this.props.team;
		var logoClass = this.props.class;
		if (this.props.team === "76ers") teamName = "Sixers";
		if (this.props.team === "Trail Blazers") teamName= "Trailblazers";
		return (<Image className={logoClass} 
              src={getLogo(teamName)} />);
	}
}