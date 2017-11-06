import React, { Component }  from 'react';
import _ from 'lodash';
import { Image, NavItem, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import Headroom from 'react-headroom';

import './header.css';

const logoMouseOver = require("../../resources/images/header/headerLogoMouseOver.png");
const logoMouseOut = require("../../resources/images/header/headerLogoMouseOut.png");

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            img: logoMouseOut
        };
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    handleMouseOver()
    {
        this.setState({
            img: logoMouseOver
        })
    }

    handleMouseOut()
    {
        this.setState({
            img: logoMouseOut
        })
    }

    renderItems() {
        return _.map(this.props.navItems, (navItem, index) =>
            <LinkContainer key={index} to={navItem.url}>
                <NavItem key={index}><h3>{navItem.label}</h3></NavItem>
            </LinkContainer>
        );
    }

    render() {
        return (
            <div>
        		<Headroom style={{
                    WebkitTransition: 'all .5s ease-in-out',
                    MozTransition: 'all .5s ease-in-out',
                    OTransition: 'all .5s ease-in-out',
                    transition: 'all .5s ease-in-out'}}
                >
                    <Navbar>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <LinkContainer to="/" style={{height: '90px'}}>
                                    <Image onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} src={this.state.img} responsive />
                                </LinkContainer>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav pullRight>
                                {this.renderItems()}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Headroom>
            </div>
        );
    }
}