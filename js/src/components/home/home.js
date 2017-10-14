import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render(){
        return (
            <div class="text-center">
                <Jumbotron>
                    <h1>Hey Sixers fans!</h1>
                    <p>Welcome to Trust The Tickets.</p>
                    <p><LinkContainer to="/pick-tickets"><Button bsStyle="primary">Search for Tickets</Button></LinkContainer></p>
                </Jumbotron>
            </div>
        );
    }
}
