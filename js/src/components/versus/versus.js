import React, {Component} from 'react';
import {Grid, Row, Col, Well, Panel, Button, Image, ListGroup, ListGroupItem} from 'react-bootstrap';
import _ from 'lodash';
import {TTTGet, TTTPost} from '../backend/ttt-request';
import {LinkContainer} from 'react-router-bootstrap';
import {getLogo} from '../logos/logo-central';
import Logo from '../logos/logo';
import TeamLogo from './team-logo';
import '../../stylesheet.css';

export default class Versus extends Component {
    teams = [];

    constructor(props) {
        const sportTypeID = 1;
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

    renderGameList() {
        return _.map(this.state.games, (game, id) =>
            <LinkContainer to={"/pick-tickets?event=" + game.event_id}>
                <ListGroupItem>
                    <div className='unselectable text-center'>
                        {game.away_team_name} at {game.home_team_name}
                        <br/>
                        on {game.date}
                        <br/>
                    </div>
                </ListGroupItem>
            </LinkContainer>
        );
    }

    getGamesByTeam(team_id) {
        TTTPost("/games-by-team", {
            team_id: team_id
        })
            .then(res => {
                this.setState({games: res.data.games});
            });
    }

    onTeamSelect(team) {
        this.getGamesByTeam(team.team_id);
    }

    renderLogos() {
        return _.map(this.state.teams, (team, id) =>
            <TeamLogo team={team} onClick={this.onTeamSelect.bind(this)} />
        );
    }

    render() {
        return (
            <div className='globalBody globalImage'>
                <div className='globalBody globalImageOverlay'>
                        <Well className='eventCalendarViewEventsWell'>
                            Choose Your Opponent
                        </Well>
                        <Grid>
                            <Row>
                                <div style={{display: 'flex', overflowX: 'scroll'}}>
                                    {this.renderLogos()}
                                </div>
                            </Row>
                            <Row>
                                <Col xs={1} sm={1} md={3} lg={2}>
                                </Col>
                                <Col xs={10} sm={10} md={6} lg={8}>
                                    <div>
                                        {this.renderGameList()}
                                    </div>
                                </Col>
                                <Col xs={1} sm={1} md={3} lg={2}>
                                </Col>
                            </Row>
                        </Grid>
                </div>
            </div>
        );
    }
}
