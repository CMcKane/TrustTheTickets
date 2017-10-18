import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../home/home.css';

export default class Home extends Component {

    render() {
        return (
            <div>
                <div className="text-center">
                <Jumbotron style={{background: 'transparent'}}>
                    <h1 className="border-white" style={{color: 'rgb(45, 98, 183)', fontSize: 100, fontWeight: 'bold'}}>
                        Hey Sixers fans!
                    </h1>
                    <p className="border-white" style={{color: 'rgb(45, 98, 183)', fontSize: 43, fontWeight: 'bold'}}>
                        Welcome to Trust The Tickets.
                    </p>
                    <LinkContainer to="/pick-tickets">
                        <Button bsStyle="primary">
                            Search for Tickets
                        </Button>
                    </LinkContainer>
                </Jumbotron>
                </div>
            </div>
        );
    }
}
