import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render(){
        return (
            <div>
                <Jumbotron>
                    <h1>Hey Sixers fans!</h1>
                    <p>Click below to choose the game you would like tickets for!</p>
                    <p><Button bsStyle="primary" href="/events">List of Games</Button></p>
                </Jumbotron>
            </div>
        );
    }
}