import React, {Component} from 'react';
import {Grid, Row, Col, Well, Panel, Button, Image} from 'react-bootstrap';
import _ from 'lodash';
import {TTTGet, TTTPost} from '../backend/ttt-request';
import {LinkContainer} from 'react-router-bootstrap';
import {getLogo} from '../logos/logo-central';
import Logo from '../logos/logo';
import '../../stylesheet.css';

export default class Versus extends Component {
    teams = [];

    constructor(props) {
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
                <Logo team={team.team_name} class={"teamLogoLeftBig"}/>
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
            <div className='globalBody globalImage'>
                <div className='globalBody globalImageOverlay'>
                    <div className="versusCenterLists">
                        <Grid>
                            <h1>
                                <Well className='versusPickTeamsWell'>
                                    Choose the opponent you would like to see!
                                </Well>
                            </h1>
                            <Row>
                                <Col style={{overflowY: "scroll"}} md={5} lg={6}>
                                    <h3 className="versusH3"> Opponents: </h3>
                                    <Panel className="versusListOfTeams">
                                        {this.renderTeamList()}
                                    </Panel>
                                </Col>
                                <Col md={5} lg={6}>
                                    <h3 className="versusH3"> Games: </h3>
                                    <Panel className="versusListOfTeams">
                                        {this.renderGameList()}
                                    </Panel>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}
