import React, { Component }  from 'react';
import _ from 'lodash';
import { Image, NavItem, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import Headroom from 'react-headroom';

import './header.css';

export default class Header extends Component {

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
                                    <Image src={require("../../resources/images/banner-logo_upper.png")} responsive />
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