import React, {Component} from 'react';
import { Image } from 'react-bootstrap';
import { getLogo, getSVGLogo } from "./logo-central";

/**
* This class handles the creation of the team logos.
*/
export default class Logo extends Component {

    /**
    * Main rendering loop.
    */
	render() {
		var teamName = this.props.team;
		var logoClass = this.props.class;
		if (this.props.team === "76ers") teamName = "Sixers";
		if (this.props.team === "Trail Blazers") teamName= "Trailblazers";
		if (this.props.svg) {
			return (
				<div className="svgLogo">
				{getSVGLogo(teamName)}
				</div>
			);
		}
		return (<Image className={logoClass} 
              src={getLogo(teamName)} />);
	}
}