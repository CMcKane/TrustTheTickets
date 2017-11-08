import React, { Component }  from 'react';
import { Panel, Button, Grid, Row, Col } from 'react-bootstrap';
import Logo from '../../logos/logo';
import './listings.css';

export default class ListingItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
			listing: this.props.listing,
			open: false
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

	getStatus() {
		if (this.state.listing.inProgress) {
			return 'In progress';
		}
		return 'Completed';
	}

	getHeader() {
		return (
			<Grid style={{paddingLeft: "0px"}}>
				<Col xs={7} sm={6} md={5} lg={6} style={{paddingLeft: "0px"}}>
					{this.state.listing.date} - {this.getStatus()}
				</Col>
				<Col xs={5} sm={2} md={2} lg={1} style={{paddingLeft: "0px", paddingRight: "0px"}}>
					{this.getButton()}
				</Col>
			</Grid>); 
	}

	getSeats() {
		var seats = this.state.listing.seats[0];
		if (this.state.listing.seats.length > 1) {
			seats = seats + '-' + this.state.listing.seats[this.state.listing.seats.length-1];
		}
		return seats;
	}

	getContent() {
		return (
			<Grid style={{paddingLeft: "0px"}}>
				<Col xsHidden sm={1} md={1} lg={1} style={{paddingLeft: "0px"}}>
					<Logo class="listingsTeamLogo" team={this.props.listing.awayTeam}/>
				</Col>
				<Col xs={11} sm={7} md={5} lg={5} style={{paddingLeft: "0px"}}>
					<p style={{paddingLeft: "0px"}}>
					{this.state.listing.homeTeam} vs {this.state.listing.awayTeam} <br/>
					Section: {this.state.listing.section} Row: {this.state.listing.row} Seats: {this.getSeats()} <br/>
					Price: {this.state.listing.price} <br/>
					Minimum group size: {this.state.listing.minSellSize} <br/>
					</p>
				</Col>
			</Grid>
		);
	}

	getButton() {
		if (this.state.listing.inProgress) {
			return (
				<Button onClick={this.editListing.bind(this)} style={{float: 'right'}}>
	                Edit
	        	</Button>
			);
		}
		return (
			<Button style={{float: 'right'}} 
				onClick={() => this.setState({ open: !this.state.open })}>
          		Order Details
        	</Button>
		);
	}

	getListing() {
		return (
			<Row>
				<div className="listingItem">
				    <Col xs={10} sm={10} md={10} lg={10} style={{padding: "0px"}}>
						{this.getContent()}
					</Col>
				</div>
			</Row>
		);
	}

	getCollapsiblePanel() {
		if (!this.state.listing.inProgress){
			return (
				<Panel collapsible expanded={this.state.open} style={{marginBottom: "0px"}}>
		    		Order Details
		    	</Panel>
			);
		}
	}

	getPanel() {
		if (this.state.listing.inProgress) {
			return (
			<Panel bsStyle='primary' header={this.getHeader()} style={{marginTop: "10px", marginBottom: "0px"}}>
		    	<Grid>
		    		{this.getListing()}
		    	</Grid>
		    </Panel>
			);
		}
		return (
			<Panel header={this.getHeader()} style={{marginTop: "10px", marginBottom: "0px"}}>
		    	<Grid>
		    		{this.getListing()}
		    	</Grid>
		    </Panel>
		);
	}

	render() {
		return (
			<div style={{paddingBottom: "0px"}}>
			{this.getPanel()}
		    {this.getCollapsiblePanel()}
		    </div>
		);
	}
}
