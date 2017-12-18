import React, {Component} from 'react';
import Logo from '../logos/logo';

/**
* Renders the team logos for each team.
*/
export default class TeamLogo extends Component {

    /**
    * Constructor.
    */
	 constructor(props) {
        super(props);
        this.state = {
        	games: []
        }
    }

    /**
    * Handle when a user clicks on a team logo on the versus page.
    */
    onLogoClick() {
    	this.props.onClick(this.props.team);
    }

    /**
    * Main rendering loop.
    */
	render() {
		return (
            <div className="versusLogo" 
            	onClick={this.onLogoClick.bind(this)}
            	style={{float: 'left', flex: '0 0 130px'}}>
                <Logo team={this.props.team.team_name} svg />
            </div>
		);
	}

}
