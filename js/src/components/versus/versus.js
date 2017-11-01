import React, { Component } from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel,
        FormControl, Well, ListGroup, ListGroupItem} from 'react-bootstrap';
import _ from 'lodash';
import {TTTGet, TTTPost} from '../backend/ttt-request';
import '../versus/versus.css';

export default class Versus extends Component {

    constructor(props){
        super(props);
        this.state = {
            teams: [],
            city: '',
            name: ''
        }
        this.getAllTeams();
    }

    //Retrieves every team
    getAllTeams() {
        TTTPost("/all-teams")
            .then(res => {
                console.log(res);
                const teams = res.data.teams;
                this.setState({teams});
            });
    }

    //render the teams in the panel
    renderTeamList() {
        return _.map((team, id) =>
            <option key={id} value={team.team_id}>
                City: {team.city} Name: {team.team_name}
            </option>
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
