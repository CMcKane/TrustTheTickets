import React, { Component }  from 'react';
import { Panel, Button, Grid, Row, Col } from 'react-bootstrap';
import Logo from '../../logos/logo';
import '../../../stylesheet.css';

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
			<Grid className='listingItemGrid'>
				<Col className='listingItemHeaderStatusColumn' xs={7} sm={6} md={5} lg={6}>
					{this.state.listing.date} - {this.getStatus()}
				</Col>
				<Col className='listingItemHeaderButtonColumn' xs={5} sm={2} md={2} lg={1}>
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
			<Grid className='listingItemGrid'>
				<Col className='listingItemNoLeftPadding' xsHidden sm={1} md={1} lg={1}>
					<Logo class="listingsTeamLogo" team={this.props.listing.awayTeam}/>
				</Col>
				<Col className='listingItemNoLeftPadding' xs={11} sm={7} md={5} lg={5}>
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
				<Button className='listingItemButton' onClick={this.editListing.bind(this)}>
	                Edit
	        	</Button>
			);
		}
		return (
			<Button className='listingItemButton'
				onClick={() => this.setState({ open: !this.state.open })}>
          		Order Details
        	</Button>
		);
	}

	getListing() {
		return (
			<Row>
				<div className="listingItem">
				    <Col className='listingItemNoPadding' xs={10} sm={10} md={10} lg={10}>
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
			<Panel className='listingItemPanelMargins' bsStyle='primary' header={this.getHeader()}>
		    	<Grid>
		    		{this.getListing()}
		    	</Grid>
		    </Panel>
			);
		}
		return (
			<Panel className='listingItemPanelMargins' header={this.getHeader()}>
		    	<Grid>
		    		{this.getListing()}
		    	</Grid>
		    </Panel>
		);
	}

	render() {
		return (
			<div className='listingItemNoBottomPadding'>
			{this.getPanel()}
		    {this.getCollapsiblePanel()}
		    </div>
		);
	}
}
