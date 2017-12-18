import React, { Component }  from 'react';
import { Panel, Button, Grid, Row, Col } from 'react-bootstrap';
import Logo from '../../logos/logo';
import Time from 'react-time';

/**
* This class is used to render an individual listing item.
*/
export default class ListingItem extends Component {

    /**
    * Constructor.
    */
	constructor(props) {
		super(props);
		this.state = {
			listing: this.props.listing,
			open: false
		}
	}

    /**
    * Hides the listing Open details.
    */
	onHide() {
		this.setState({
			open: false
		});
	}

    /**
    * Handles when the user updates the listing.
    */
	submitListing() {
		this.props.updateListing(this.state.listing.groupID);
	}

    /**
    * Get the status of the listing.
    */
	getStatus() {
		if (this.inProgress()) {
			return 'In Progress';
		}
		return 'Completed';
	}

    /**
    * Get the total charges for the seller.
    */
	getSellerTotal() {
		return (this.props.listing.transactionTotal - this.props.listing.chargesTotal);
	}

    /**
    * Create and get the header of the listing item.
    */
	getHeader() {
		if(this.inProgress()) {
			return (
			<Grid className='listingItemGrid'>
				<Col className='listingItemHeaderStatusColumn' xs={4} sm={5} md={5} lg={5}>
					{this.getStatus()}
				</Col>
				<Col className='listingItemHeaderButtonColumn' xs={8} sm={4} md={4} lg={4}>
					{this.getButton()}
				</Col>
			</Grid>); 
		}
		return (
			<Grid className='listingItemGrid'>
				<Col className='listingItemHeaderStatusColumn' xs={7} sm={7} md={7} lg={8}>
					<Time value={this.props.listing.transactionDate} format="MMMM D, YYYY" /> - {this.getStatus()}
				</Col>
				<Col className='listingItemHeaderButtonColumn' xs={5} sm={2} md={2} lg={1}>
					{this.getButton()}
				</Col>
			</Grid>); 
	}

    /**
    * Gets the seat numbers for the tickets in the listing.
    */
	getSeats() {
		var seats = this.state.listing.seats[0];
		if (this.state.listing.seats.length > 1) {
			seats = seats + '-' + this.state.listing.seats[this.state.listing.seats.length-1];
		}
		return seats;
	}

    /**
    * Renders the buttons on the listing that the user can click.
    */
	getButton() {
		if (this.inProgress()) {
			return (
				<div>
					<Button className='listingItemButton'  style={{marginLeft: '5px'}}
							onClick={() => this.props.showCancelModal(this.state.listing)}>
		                Cancel Listing
		        	</Button>
					<Button className='listingItemButton' 
							onClick={() => this.props.showModal(this.state.listing)}>
		                Edit
		        	</Button>
	        	</div>
			);
		}
		return (
			<Button className='listingItemButton'
				onClick={() => this.setState({ open: !this.state.open })}>
          		Order Details
        	</Button>
		);
	}

    /**
    * Gets all of the content that will be displayed on the listing item and returns the HTML.
    */
	getContent() {
		if (this.inProgress()) {
			return (
				<Grid className='listingItemGrid'>
					<Col className='listingItemLeftCol' style={{padding: "0px"}}
						xsHidden sm={2} md={2} lg={2}>
						<Logo class="listingsTeamLogo" team={this.props.listing.awayTeam}/>
					</Col>
					<Col className='listingItemRightCol' style={{padding: "0px"}}
						xs={12} sm={7} md={5} lg={5}>
						<p style={{paddingLeft: "0px"}}>
						{this.props.listing.homeTeam} vs {this.props.listing.awayTeam} <br/>
						<Time value={this.props.listing.date} format="MMMM D, YYYY h:mmA"/> <br/><br/>
						Section: {this.props.listing.section}, Row: {this.props.listing.row}, Seats: {this.getSeats()} <br/>
						Ticket Price: ${this.props.listing.price} <br/>
						Selling In Groups Of At Least: {this.props.listing.minSellSize} <br/>
						# Tickets Listed: {this.props.listing.totalTicketNum} <br/>
						# Tickets Remaining: {this.props.listing.availableTicketNum} <br/>
						</p>
					</Col>
				</Grid>
			);
		}
		return (
			<Grid className='listingItemGrid'>
				<Col className='listingItemLeftCol' style={{padding: "0px"}}
					xsHidden sm={2} md={2} lg={2}>
					<Logo class="listingsTeamLogo" team={this.props.listing.awayTeam}/>
				</Col>
				<Col className='listingItemRightCol' style={{padding: "0px"}}
					xs={12} sm={7} md={5} lg={5}>
					<p style={{paddingLeft: "0px"}}>
					{this.props.listing.homeTeam} vs {this.props.listing.awayTeam} <br/>
					<Time value={this.props.listing.date} format="MMMM D, YYYY h:mmA"/> <br/><br/>
					Number of Tickets Sold: {this.props.listing.numTicketsSold} <br/>
					Total: ${this.getSellerTotal()} <br/>
					Sell Date: <Time value={this.props.listing.transactionDate} format="MMMM D, YYYY" /> <br/>
					</p>
				</Col>
			</Grid>
		);
	}

    /**
    * Get the listing item.
    */
	getListing() {
		return (
			<Row>
				<div className="listingItem">
				    <Col className='listingItemNoPadding' style={{paddingLeft: "0px"}}xs={10} sm={10} md={10} lg={10}>
						{this.getContent()}
					</Col>
				</div>
			</Row>
		);
	}

    /**
    * Get the listing item panel.
    */
	getPanel() {
		if (this.inProgress()) {
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

    /**
    * Get the collapsible additional listing details panel.
    */
	getCollapsiblePanel() {
		if (!this.inProgress()){
			return (
				<Panel collapsible expanded={this.state.open} style={{marginBottom: "0px"}}>
					<h5> Order Details - </h5>
					<h5>Transaction Completed On: <Time value={this.props.listing.transactionDate} format="MMMM D, YYYY h:mmA"/></h5>
		    		<p style={{paddingLeft: "0px"}}>
		    		Tickets Sold: Section: {this.props.listing.section} Row: {this.props.listing.row} Seats: {this.getSeats()} <br/>
					{this.props.listing.numTicketsSold} Tickets Sold @ ${this.props.listing.price}/ea <br/>
					Transaction Total: ${this.getSellerTotal()} <br/>
					</p>
		    	</Panel>
			);
		}
	}

    /**
    * Set the listing to in progress.
    */
	inProgress() {
		return this.props.listing.groupID;
	}

    /**
    * Main rendering loop.
    */
	render() {
		return (
			<div className='listingItemNoBottomPadding'>
				{this.getPanel()}
		    	{this.getCollapsiblePanel()}
		    </div>
		);
	}
}
