import React, {Component} from 'react';
import {Button, Grid, Row, Col, Thumbnail} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import '../home/home.css';

export default class Home extends Component {

    render() {
        return (
            <body>
            <div className="bgimg1">
                <div className="caption">
                    <span className="border">Hey Philly Fans,</span>
                    <br/>
                    <br/>
                    <span className="border">Welcome to Trust The Tickets!</span>
                    <br/>
                    <br/>
                    <span className="border">The first Philly-centric Ticket Resale Site!</span>
                    <br/>
                    <br/>
                    <span className="border">Tickets by the fans, for the fans.</span>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>
            </div>

            <div className="textsection">
                <h3>Choose your process!</h3>
                <p>Here at Trust the Tickets, we want to make finding tickets for your favorite Philly team a breeze.
                    Through out the seasons we have been told to trust the process, so that's what we do.
                    <br/>
                    <br/>
                    Know exactly what you're looking for? Choose the option that fits best!
                    <br/>
                    If not, don't worry we got you covered.
                </p>
            </div>

            <div className="bgimg2">
                <div>
                    <Grid>
                        <Row>
                            <Col xs={6} md={4}>
                                <Thumbnail src={require("../../resources/images/Calendar_Blue.png")}>
                                    <h3 style={{color: 'white'}}>Calendar View</h3>
                                    <p style={{color: 'white'}}>Search for games via our game calendar.</p>
                                    <p>
                                        <LinkContainer to="/event-calendar">
                                            <Button bsSize="large" bsStyle="default">
                                                Search Games
                                            </Button>
                                        </LinkContainer>
                                    </p>
                                </Thumbnail>
                            </Col>
                            <Col xs={6} md={4}>
                                <Thumbnail src={require("../../resources/images/versus.png")}>
                                    <h3 style={{color: 'white'}}>Opponent</h3>
                                    <p style={{color: 'white'}}>Search for a game against a specific opponent.</p>
                                    <p>
                                        <LinkContainer to="/event-list">
                                            <Button bsSize="large" bsStyle="default">
                                                Search Opponents
                                            </Button>
                                        </LinkContainer>
                                    </p>
                                </Thumbnail>
                            </Col>
                            <Col xs={6} md={4}>
                                <Thumbnail src={require("../../resources/images/money.png")}>
                                    <h3 style={{color: 'white'}}>Ticket Prices</h3>
                                    <p style={{color: 'white'}}>Search for a game based off of ticket prices.</p>
                                    <p>
                                        <LinkContainer to="/pick-tickets">
                                            <Button bsSize="large" bsStyle="default">
                                                Search Prices
                                            </Button>
                                        </LinkContainer>
                                    </p>
                                </Thumbnail>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>

            <div className="textsection">
                <h3>Not only can you buy tickets, you can also sell them too!</h3>
                <p>
                    We know Philly fans are super passionate about their sports teams, but we can't always make the game.
                    Trust the Tickets allows you to sell your precious game day tickets to fellow Philly fans, without the crazy charges and fees!
                </p>
            </div>

            <div className="bgimg3">
                <div className='centered'>
                    <Grid>
                        <Row>
                            <Col xs={6} md={4}>
                                <Thumbnail src={"../../resources/images/Calendar_Blue.png"}>
                                    <h3 style={{color: 'black'}}>Sell Your Tickets</h3>
                                    <p style={{color: 'black'}}>Sell tickets to games you can't make!</p>
                                    <p>
                                        <Button bsSize="large" bsStyle="default">Sell Tickets</Button>
                                    </p>
                                </Thumbnail>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>

            </body>
        );
    }
}
