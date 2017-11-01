import React, { Component }  from 'react';
import {Image, Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

export default class TThumbnail extends Component {


	render() {
		return (
			<div style={{"textAlign": "center"}}>
				<Image src={this.props.src} responsive />
	            <h3 style={{color: 'white'}}>{this.props.heading}</h3>
	            <p style={{color: 'white'}}>{this.props.description}</p>
	            <p>
	                <LinkContainer to={this.props.to}>
	                    <Button bsSize="large" bsStyle="default">
	                        {this.props.buttonText}
	                    </Button>
	                </LinkContainer>
	            </p>
            </div>
		);
	}
}
