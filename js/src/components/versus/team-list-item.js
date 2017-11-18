import React, {Component} from 'react';
import Logo from '../logos/logo';
import _ from 'lodash';
import { Panel, Button, ListGroupItem } from 'react-bootstrap';
import {TTTPost} from '../backend/ttt-request';
import {LinkContainer} from 'react-router-bootstrap';

export default class TeamListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
        	open: false,
        	games: []
        }
    }

    handleClick() {
    	if (this.state.open) {
    		this.setState({open: false});
    	}
    	else {
    		this.getGamesByTeam(this.props.team.team_id);
    	}
    }

    getGamesByTeam(team_id) {
        TTTPost("/games-by-team", {
            team_id: this.props.team.team_id
        })
            .then(res => {
                this.setState({open: true, games: res.data.games});
            });
    }

    renderGameList() {
        return _.map(this.state.games, (game, id) =>
            <li className="list-group-item" border-color="red">
                {game.away_team_name} at {game.home_team_name}
                <br/>
                on {game.date}
                <br/>
                <Logo team={game.away_team_name} class={"teamLogoLeft"}/>
                <LinkContainer to={"/pick-tickets?event=" + game.event_id}>
                    <Button> Purchase Tickets </Button>
                </LinkContainer>
                <Logo team={game.home_team_name} class={"teamLogoRight"}/>
            </li>
        );
    }

	render() {
		return (
			<div>
	            <ListGroupItem
	            	onClick={this.handleClick.bind(this, this.props.team.team_id)}>
	                <div className='unselectable'>
	                    <Logo team={this.props.team.team_name} class={"teamLogoLeftBig"}/>
	                    <p>
	                        {this.props.team.city} {this.props.team.team_name}
	                    </p>
	                </div>
	            </ListGroupItem>
                <Panel collapsible expanded={this.state.open} style={{marginBottom: "0px"}}>
                	{this.renderGameList()}
                </Panel>
	        </div>
        );
	}
}