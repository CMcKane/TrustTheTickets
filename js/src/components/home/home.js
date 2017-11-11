import React, {Component} from 'react';
import {Button, Panel, Grid, Row, Col, Image} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { Parallax } from 'react-parallax';

// import icons from the react-icons/lib directory.
// There are five libraries of icons that you can view at their websites
//      Font Awesome: http://fontawesome.io/icons/
//      TypeIcons: http://s-ings.com/typicons/
//      IonIcons (IOS): http://ionicons.com/
//      MaterialIcons (Google): https://material.io/icons/
//      GithubOcticons: https://octicons.github.com/
import GoCalendar from 'react-icons/lib/go/calendar';
import GoJersey from 'react-icons/lib/go/jersey';
import IonSocialUsd from 'react-icons/lib/io/social-usd'
import '../../stylesheet.css';

export default class Home extends Component {

    renderSearchOptions()
    {
        return (
            <div className="homeCenterThisWithPadding">
                <Grid>
                    <Row>
                        <Col md={4} lg={4} xl={4}>
                            <Panel className="homePanel">
                                <div className="homeSearchCenter">
                                    <GoCalendar className="homeIcons" color="#EC174C"/>
                                </div>
                                <div className="homeSearchDesc">
                                    Not sure when to go? Search our Event Calendar!
                                </div>
                                <div className="homeSearchCenter">
                                    <LinkContainer to="/event-calendar">
                                        <Button bsSize="large" bsStyle="success">Let's go!</Button>
                                    </LinkContainer>
                                </div>
                            </Panel>
                        </Col>
                        <Col md={4} lg={4} xl={4}>
                            <Panel className="homePanel">
                                <div className="homeSearchCenter">
                                    <GoJersey className="homeIcons" color="#EC174C"/>
                                </div>
                                <div className="homeSearchDesc">
                                    Want to see a particular team? Search by opponents!
                                </div>
                                <div className="homeSearchCenter">
                                    <LinkContainer to="/versus">
                                        <Button bsSize="large" bsStyle="success">Let's go!</Button>
                                    </LinkContainer>
                                </div>
                            </Panel>
                        </Col>
                        <Col md={4} lg={4} xl={4}>
                            <Panel className="homePanel">
                                <div className="homeSearchCenter">
                                    <IonSocialUsd className="homeIcons" color="#EC174C"/>
                                </div>
                                <div className="homeSearchDesc">
                                    Short on dough? Search for the cheapest seats!
                                </div>
                                <div className="homeSearchCenter">
                                    <LinkContainer to="/pick-tickets?event=0">
                                        <Button bsSize="large" bsStyle="success">Let's go!</Button>
                                    </LinkContainer>
                                </div>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }

    render() {
        return (
            <div>
                <Parallax bgImage={require("../../resources/images/backgrounds/philadelphia.jpg")} strength={300}>
                    <div className="homeParallaxSize homeBlueOverlay">
                        <Image src={require("../../resources/images/homeLogo.png")} responsive className="homeCenterThis homeMainLogo"/>
                    </div>
                </Parallax>
                <div className="homeParallaxDivider homeBlueOverlay">
                    <Panel>
                        <div className="homeParallaxText">
                            <div className="homeParallaxTextHeader">
                                Welcome to Trust the Tickets, Philadelphia's first fan-centered ticket website.
                            </div>
                            <div className="homeParallaxTextBody">
                                TTT exists to get you tickets to Philly sports games, quicker, simpler, and cheaper. How?
                                <div className="homeParallaxTextBodyBlock">
                                    <div className="homeParallaxTextBodyBlockText">
                                        <ol>
                                            <li>We specialize in Philly sports tickets - you don't have to wade through irrelevant ticketing events during your search.</li>
                                            <li>Our search methods were designed with fans in mind - We know how to find what you want, quicker!</li>
                                            <li>We value the fans that list with us, so we offer the LOWEST transaction fees of any ticket reseller. When you win, we win.</li>
                                        </ol>
                                    </div>
                                </div>
                                So how do I get started?
                                <div className="homeParallaxTextBodyBlock">
                                    <div className="homeParallaxTextBodyBlockText">
                                        Check out our three searching methods below to find tickets to your next game, and Trust the Process.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
                <Parallax bgImage={require("../../resources/images/backgrounds/wellsFargoNightBlur.png")} strength={300}>
                    <div className="homeParallaxSearchSize homeBlueOverlay">
                        {this.renderSearchOptions()}
                    </div>
                </Parallax>
            </div>
        );
    }
}
