import React, { Component }  from 'react';
import _ from 'lodash';
import { NavItem, Navbar, Nav } from 'react-bootstrap';
import { Router } from 'react-router'

export default class Header extends Component {
    renderItems() {
    	return _.map(this.props.navItems, (navItem, index) => 
            <NavItem onClick={this.onNavClick.bind(this, navItem.url)} key={index} href={navItem.url}>{navItem.label}</NavItem>);
    }

    onNavClick(url) {
        Router.history.push(url);
    }

    render() {
        return (
        		<Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">TrustTheTickets</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
        				    {this.renderItems()}
                        </Nav> 
                    </Navbar.Collapse>
        		</Navbar> 
        );
    }
}
