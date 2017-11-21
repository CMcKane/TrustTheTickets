import React, { Component }  from 'react';
import _ from 'lodash';
import { Image, NavItem, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Headroom from 'react-headroom';
import '../../stylesheet.css';

const logoMouseOver = require("../../resources/images/header/headerLogoMouseOver.png");
const logoMouseOut = require("../../resources/images/header/headerLogoMouseOut.png");

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            img: logoMouseOut,
            navExpanded: false
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
                <NavItem key={index}><h3 className='nav-item-header'>{navItem.label}</h3></NavItem>
            </LinkContainer>
        );
    }

    setNavExpanded(expanded) {
        this.setState({ navExpanded: expanded});
    }

    closeNav() {
        this.setState({navExpanded: false});
    }

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