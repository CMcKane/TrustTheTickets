import React, { Component }  from 'react';
import _ from 'lodash';
import { NavItem, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

export default class Header extends Component {
    renderItems() {
    	return _.map(this.props.navItems, (navItem, index) =>
            <LinkContainer to={navItem.url}>
                <NavItem key={index}>{navItem.label}</NavItem>
            </LinkContainer>
        );
    }

    render() {
        return (
        		<Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">TrustTheTickets</Link>
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
