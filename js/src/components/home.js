import React, { Component, Jumbotron } from 'react';
import { Button } from 'react-bootstrap';

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
                    <h1>Hello, world!</h1>
                    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                    <p><Button bsStyle="primary">Learn more</Button></p>
                </Jumbotron>
            </div>
        );
    }
}