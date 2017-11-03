import React, { Component } from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel,
    FormControl, Well, ListGroup, ListGroupItem, Panel, Button} from 'react-bootstrap';
import _ from 'lodash';
import {TTTGet, TTTPost} from '../backend/ttt-request';
import '../versus/versus.css';

export default class Versus extends Component {
    teams = [];

    constructor(props){
        const sportTypeID = 1;
        console.log("IN constructor");
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
                console.log(res.data.teams);
                console.log("IN TTTPost");
                this.setState({teams: res.data.teams});
            });
    }

    //render the teams in the panel
    renderTeamList() {
        return _.map(this.state.teams, (team, id) =>
            <li class="list-group-item" border-color="red">
                <Button onClick={() => this.setState({selectedTeam: team.team_id})}> {team.city} {team.team_name} {team.team_id} </Button>
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
                        <Panel className = "list-of-teams">
                          GAMES HERE
                            {/*{this.renderGameList()}*/}
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
 }
