import React, { Component } from 'react';
import {Grid, Row, Col, Well, Panel, Button, Image} from 'react-bootstrap';
import _ from 'lodash';
import {TTTGet, TTTPost} from '../backend/ttt-request';
import {LinkContainer} from 'react-router-bootstrap';
import {getLogo} from '../logos/logo-central';
import '../versus/versus.css';

export default class Versus extends Component {
    teams = [];

    constructor(props){
        const sportTypeID = 1;
        console.log("IN constructor");
        super(props);
        this.state = {
            teams: [],
            games: [],
            selectedTeam: 0,
            sportTypeID: sportTypeID
        }
        this.getAllTeams(sportTypeID);
    }

    //Retrieves every team
    getAllTeams(sportTypeID) {
        TTTGet("/all-teams", {
            sportTypeID: sportTypeID
        })
            .then(res => {
                console.log(res.data.teams);
                console.log("IN TTTPost");
                this.setState({teams: res.data.teams});
            });
    }

    handleClick(team_id) {
        console.log(team_id);
        this.getGamesByTeam(team_id);
    }
    //render the teams in the left panel
    renderTeamList() {
        return _.map(this.state.teams, (team, id) =>
            <li className="list-group-item" border-color="red" key={team.team_id}>
                <Image src = {getLogo(team.team_name)} height = "40" width = "40" align="left"></Image>
                <Button onClick={this.handleClick.bind(this, team.team_id)}>
                {team.city} {team.team_name} </Button>
            </li>
        );

    }

    //Retrieves every team
    getGamesByTeam(team_id) {
        TTTPost("/games-by-team", {
            team_id: team_id
        })
            .then(res => {
                console.log(res.data.games);
                console.log("IN TTTPost GAMES");
                this.setState({games: res.data.games});
            });
    }

    //render the games in the middle panel
    renderGameList() {
        return _.map(this.state.games, (game, id) =>
            <li className="list-group-item" border-color="red">
                {game.away_team_name} at {game.home_team_name}
                <br />
                on {game.date}
                <br />
                <Image src = {getLogo("bulls")} height = "40"
                       width = "40" align="left"></Image>
                <LinkContainer to={"/pick-tickets?event=" + game.event_id}>
                    <Button> Purchase Tickets </Button>
                </LinkContainer>
                <Image src = {getLogo("76ers")} height = "40"
                       width = "40" align="right"></Image>
            </li>
        );
    }

    render(){
        return (
            <Grid>
                <h1 className="border-white">
                    <Well className='pick-teams-well' style={{background: 'transparent'}}>
                        Choose the opponent you would like to see!
                    </Well>
                </h1>
                <Row>
                    <Col lg={4}>
                        <h3 className="text-center"> Opponents: </h3>
                        <Panel className="list-of-teams">
                            {this.renderTeamList()}
                        </Panel>
                    </Col>
                    <Col lg={4}>
                        <h3 className="text-center"> Games: </h3>
                        <Panel className="list-of-teams">
                            {this.renderGameList()}
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
 }
