import React, { Component }  from 'react';
import _ from 'lodash';
import { Image, NavItem, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Headroom from 'react-headroom';
import '../../stylesheet.css';

const logoMouseOver = require("../../resources/images/header/headerLogoMouseOver.png");
const logoMouseOut = require("../../resources/images/header/headerLogoMouseOut.png");

/**
* This is a global class than can be used to create headers for web pages.
*/
export default class Header extends Component {

    /**
    * Constructor
    */
    constructor(props) {
        super(props);

        this.state = {
            img: logoMouseOut,
            navExpanded: false
        };
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    /**
    * Handle when the user hovers over a logo.
    */
    handleMouseOver()
    {
        this.setState({
            img: logoMouseOver
        })
    }

    /**
    * Handle when the user moves the mouse away.
    */
    handleMouseOut()
    {
        this.setState({
            img: logoMouseOut
        })
    }

    /**
    * Renders the items in the navigation bar.
    */
    renderItems() {
        return _.map(this.props.navItems, (navItem, index) =>
            <LinkContainer key={index} to={navItem.url}>
                <NavItem key={index}><h3 className='nav-item-header'>{navItem.label}</h3></NavItem>
            </LinkContainer>
        );
    }

    /**
    * Sets the navigation bar to expanded.
    * @param expanded - the expansion value.
    */
    setNavExpanded(expanded) {
        this.setState({ navExpanded: expanded});
    }

    /**
    * Closes the navigation bar.
    */
    closeNav() {
        this.setState({navExpanded: false});
    }

    /**
    * Main rendering loop.
    */
    render() {
        return (
            <div className="headerContainer">
        		<Headroom style={{
                    WebkitTransition: 'all .5s ease-in-out',
                    MozTransition: 'all .5s ease-in-out',
                    OTransition: 'all .5s ease-in-out',
                    transition: 'all .5s ease-in-out'}} disableInlineStyles>
                    <Navbar
                            onToggle={this.setNavExpanded.bind(this)}
                            expanded={this.state.navExpanded}>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <LinkContainer to="/" className='navbar-img'>
                                    <Image onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} src={this.state.img} responsive />
                                </LinkContainer>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav pullRight
                                onSelect={this.closeNav.bind(this)}>
                                {this.renderItems()}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Headroom>
            </div>
        );
    }
}