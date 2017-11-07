import React, { Component }  from 'react';
import { Panel, Button, Grid, Row, Col } from 'react-bootstrap';

export default class ListingItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
			editing: this.props.editing,
			listing: this.props.listing
		}
	}

	editListing() {
		this.setState({
			editing: true
		});
	}

	submitListing() {
		this.props.updateListing(this.state.listing.groupID);
	}

	getContent() {
		return this.props.listing.awayTeam;
	}

	getButton() {
		if (this.state.editing) {
			return (
				<Button bsStyle='primary'
	                onClick={this.submitListing.bind(this)}>
	                Submit
	        	</Button>
			);
		}
		return (
			<Button bsStyle='primary'
                onClick={this.editListing.bind(this)}>
                Edit
        	</Button>
		);
	}

	getListing() {
		return (
			<Row>
			    <Col xs={8} sm={7} md={6} lg={6}>
					{this.getContent()}
				</Col>
				<Col xs={2} sm={3} md={2} lg={2}>
					{this.getButton()}
				</Col>
			</Row>
		);
	}

	render() {
		return (
		    <Panel header={this.props.listing.date}>
		    	<Grid>
		    		{this.getListing()}
		    	</Grid>
		    </Panel>
		);
	}
}
