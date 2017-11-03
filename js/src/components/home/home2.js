import React, {Component} from 'react';
import {Button, Grid, Row, Col, Thumbnail, Image} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import Header2 from '../global/header2';
import { Parallax, Background } from 'react-parallax';

import './home2.css';

const navItems2 = [
    {
        label: 'Home2',
        url: '/2'
    },
    {
        label: 'My Account',
        url: '/my-account'
    }
    ,
    {
        label: 'Calendar',
        url: '/event-calendar?m=' + new Date().getMonth() + '&y=' + new Date().getFullYear()
    },
    {
        label: 'Teams',
        url: '/event-list'
    }
];

export default class Home2 extends Component {

    constructor(props) {
        super(props);
        this.callUpdateSecondHome(true);
        this.state = {
            navItems2
        };
    }

    callUpdateSecondHome(value){
        this.props.updateSecondHome(value);
    }

    render() {
        return (
            <div>
                <Header2 navItems={this.state.navItems2} />
                <Parallax bgImage={require("../../resources/images/city.jpg")} strength={200}>
                    <div className="blueOverlay">
                        <Image src={require("../../resources/images/overlay.png")} responsive className="imageOverlay"/>
                    </div>
                </Parallax>
                <div className="parallaxDivider">
                    <div className="pdHeader">
                        Welcome to Trust the Tickets, Philiadelphia's first fan-centered ticket website.
                    </div>
                    <div className="pdText">

                    </div>
                </div>
                <Parallax bgImage={require("../../resources/images/FishEyeWellsFargo.jpg")} strength={500}>
                    <div className="blankSpace">
                        <h1 className="imageOverlay">Sad Day...</h1>
                    </div>
                </Parallax>
            </div>
        );
    }
}
