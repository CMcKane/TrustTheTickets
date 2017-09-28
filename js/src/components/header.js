import React, { Component }  from 'react';
import _ from 'lodash';
import { NavItem, Navbar, Nav } from 'react-bootstrap';

export default class Header extends Component {
    renderItems() {
    	return _.map(this.props.navItems, (navItem, index) => 
            <NavItem href={navItem.url}>{navItem.label}</NavItem>);
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
