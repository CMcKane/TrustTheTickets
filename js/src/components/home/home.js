import React, {Component} from 'react';
import {Button, Jumbotron} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import '../home/home.css';
import {ParallaxProvider, Parallax} from 'react-scroll-parallax';

export default class Home extends Component {

    render() {
        return (
            <html>
            <body>
            <div className="bgimg1">
                <div className="caption">
                    <span className="border">Hey Sixers Fans!</span>
                    <div className="text-center" style={{padding: '25px'}}>
                        <LinkContainer to="/pick-tickets">
                            <Button bsStyle="primary">
                                Search for Tickets
                            </Button>
                        </LinkContainer>
                    </div>
                </div>
            </div>

            <div className="textsection">
                <h3>Welcome to Trust The Tickets! Choose your process!</h3>
                <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
            </div>

            <div className="bgimg2">

            </div>

            <div className="textsection">
                <h3>Welcome to Trust The Tickets! Choose your process!</h3>
                <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
            </div>

            <div className="bgimg3">

            </div>

            </body>
            </html>
        );
    }
}
