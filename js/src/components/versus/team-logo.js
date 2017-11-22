import React, {Component} from 'react';
import Logo from '../logos/logo';

export default class TeamLogo extends Component {

	 constructor(props) {
        super(props);
        this.state = {
        	games: []
        }
    }

    onLogoClick() {
    	this.props.onClick(this.props.team);
    }

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
