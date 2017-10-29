import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import {Grid, Row, Col, FormGroup, ControlLabel,
        FormControl, Well, ListGroup, ListGroupItem} from 'react-bootstrap';
import _ from 'lodash';
import {TTTGet, TTTPost} from '../backend/ttt-request';
import { LinkContainer } from 'react-router-bootstrap';
import '../versus/versus.css';

export default class Versus extends Component {

    sportTypeID = 1;
    //Retrieves every team
    getAllTeams(sportTypeID) {
        TTTGet('/all-teams')
            .then(res => {
                console.log(res);
                if (res.data.teams) this.setState({
                    sportTypeID: sportTypeID,
                    teams: res.data.teams
                });
            });
    }

    //render the teams in the panel
    renderTeamList() {
        return _.map(this.state.teams, (team, id) =>
            <ListGroupItem className="teams" id={team.team_id} >
                City: {team.city} Name: {team.team_name}
            </ListGroupItem>
        );
    }

    render(){
        return (
            <Grid>
                <h1 className="border-white">
                    <Well className='pick-tickets-well' style={{background: 'transparent'}}>
                        Choose Your Desired Section From The Seating Chart
                    </Well>
                </h1>
                <Row>
                    <Col lg={4}>
                        <h3 className="text-center"> Teams </h3>
                        <ListGroup className="list-of-teams">
                            {this.renderTeamList()}
                        </ListGroup>
                    </Col>
                </Row>
            </Grid>
        );
    }
 }
