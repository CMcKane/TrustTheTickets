import React, {Component} from 'react';
import {Grid, Row, Col, Well, Panel, Button, Image, ListGroup, ListGroupItem} from 'react-bootstrap';
import _ from 'lodash';
import {TTTGet, TTTPost} from '../backend/ttt-request';
import {LinkContainer} from 'react-router-bootstrap';
import {getLogo} from '../logos/logo-central';
import Logo from '../logos/logo';
import TeamLogo from './team-logo';
import Time from 'react-time';
import {Card} from '@blueprintjs/core';
import '../../../node_modules/@blueprintjs/core/dist/blueprint.css';
import '../../stylesheet.css';

export default class Versus extends Component {
    teams = [];

    constructor(props) {
        const sportTypeID = 1;
        super(props);
        this.state = {
            teams: [],
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
                this.setState({teams: res.data.teams});
            });
    }

    renderGameList() {
        if (this.state.games) {
            if (this.state.games.length > 0) {
                return _.map(this.state.games, (game, id) =>
                    <LinkContainer to={"/pick-tickets?event=" + game.event_id}>
                        <div className={'childItem'}>
                            <Card interactive={true} elevation={3}>
                                <div className={'versusDate'}><Time value={game.date} format={"D"}/></div>
                                <div className={'versusMonth'}><Time value={game.date} format={"MMMM"}/></div>
                                <div className={'versusTime'}><Time value={game.date} format={"h:mmA"}/></div>
                            </Card>
                        </div>
                    </LinkContainer>
                );
            }
            return <h4 className='unselectable text-center'>No games against selected team</h4>;
        }
        return <h3 className='unselectable text-center' style={{paddingTop: '30px'}}>
                Select a team logo to find your game</h3>
    }

    getGamesByTeam(team) {
        TTTPost("/games-by-team", {
            team_id: team.team_id
        })
            .then(res => {
                this.setState({team: team, games: res.data.games});
            });
    }

    getGamesHeader() {
        if(this.state.team) {
            return (
                <h3 className='unselectable text-center'>76ers vs {this.state.team.team_name}</h3>
            );
        }
    }

    onTeamSelect(team) {
        this.getGamesByTeam(team);
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
                                    <row>
                                        {this.getGamesHeader()}
                                    </row>
                                    <row>
                                        <div className={'parentItem'}>
                                            {this.renderGameList()}
                                        </div>
                                    </row>
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
