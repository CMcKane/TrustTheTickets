import React, { Component }  from 'react';
import { Panel, Button, Grid, Row, Col } from 'react-bootstrap';
import Logo from '../../logos/logo';
import Time from 'react-time';
import '../../../stylesheet.css';

export default class ListingItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
			listing: this.props.listing,
			open: false
		}
	}


	onHide() {
		this.setState({
			open: false
		});
	}

	submitListing() {
		this.props.updateListing(this.state.listing.groupID);
	}

	getStatus() {
		if (this.inProgress()) {
			return 'In progress';
		}
		return 'Completed';
	}

	getSellerTotal() {
		return (this.props.listing.transactionTotal - this.props.listing.chargesTotal);
	}

	getHeader() {
		if(this.inProgress()) {
			return (
			<Grid className='listingItemGrid'>
				<Col className='listingItemHeaderStatusColumn' xs={7} sm={6} md={5} lg={6}>
					{this.getStatus()}
				</Col>
				<Col className='listingItemHeaderButtonColumn' xs={5} sm={2} md={2} lg={1}>
					{this.getButton()}
				</Col>
			</Grid>); 
		}
		return (
			<Grid className='listingItemGrid'>
				<Col className='listingItemHeaderStatusColumn' xs={7} sm={6} md={5} lg={6}>
					<Time value={this.props.listing.transactionDate} format="MMMM D, YYYY" /> - {this.getStatus()}
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

	getButton() {
		if (this.inProgress()) {
			return (
				<Button className='listingItemButton' onClick={() => this.props.showModal(this.state.listing)}>
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

	getContent() {
		if (this.inProgress()) {
			return (
				<Grid className='listingItemGrid'>
					<Col className='listingItemNoLeftPadding' style={{padding: "0px"}}
						xsHidden sm={2} md={2} lg={2}>
						<Logo class="listingsTeamLogo" team={this.props.listing.awayTeam}/>
					</Col>
					<Col className='listingItemNoLeftPadding' style={{padding: "0px"}}
						xs={11} sm={7} md={5} lg={5}>
						<p style={{paddingLeft: "0px"}}>
						{this.state.listing.homeTeam} vs {this.state.listing.awayTeam} <br/>
						<Time value={this.state.listing.date} format="MMMM D, YYYY h:mmA"/> <br/>
						Section: {this.state.listing.section} Row: {this.state.listing.row} Seats: {this.getSeats()} <br/>
						Ticket Price: ${this.state.listing.price} <br/>
						Minimum group size: {this.state.listing.minSellSize} <br/>
						</p>
					</Col>
				</Grid>
			);
		}
		return (
			<Grid className='listingItemGrid'>
				<Col className='listingItemNoLeftPadding' style={{padding: "0px"}}
					xsHidden sm={2} md={2} lg={2}>
					<Logo class="listingsTeamLogo" team={this.props.listing.awayTeam}/>
				</Col>
				<Col className='listingItemNoLeftPadding' style={{padding: "0px"}}
					xs={11} sm={7} md={5} lg={5}>
					<p style={{paddingLeft: "0px"}}>
					{this.state.listing.homeTeam} vs {this.state.listing.awayTeam} <br/>
					Total: ${this.getSellerTotal()} <br/>
					Sell Date: <Time value={this.props.listing.transactionDate} format="MMMM D, YYYY" /> <br/>
					</p>
				</Col>
			</Grid>
		);
	}

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

	getCollapsiblePanel() {
		if (!this.inProgress()){
			return (
				<Panel collapsible expanded={this.state.open} style={{marginBottom: "0px"}}>
					<h5> Order Details - {this.props.listing.transactionDate}</h5>
		    		<p style={{paddingLeft: "0px"}}>
		    		Tickets Sold: Section: {this.state.listing.section} Row: {this.state.listing.row} Seats: {this.getSeats()} <br/>
					Ticket Price: ${this.props.listing.price} <br/>
					Total: ${this.getSellerTotal()} <br/>
					</p>
		    	</Panel>
			);
		}
	}

	inProgress() {
		return this.props.listing.groupID;
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
