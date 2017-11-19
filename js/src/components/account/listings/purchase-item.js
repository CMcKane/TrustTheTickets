import React, { Component }  from 'react';
import { Grid, Col, Row, Panel, Button } from 'react-bootstrap';
import Logo from '../../logos/logo';
import Time from 'react-time';
import '../../../stylesheet.css';

export default class PurchaseItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false
		}
	}

	getSeats() {
		var seats = this.props.purchase.seats[0];
		if (this.props.purchase.seats.length > 1) {
			seats = seats + '-' + this.props.purchase.seats[this.props.purchase.seats.length-1];
		}
		return seats;
	}

	getContent() {
		return (
			<Grid className='listingItemGrid'>
				<Col className='listingItemLeftCol' style={{padding: "0px"}}
					xsHidden sm={2} md={2} lg={2}>
					<Logo class="listingsTeamLogo" team={this.props.purchase.awayTeam}/>
				</Col>
				<Col className='listingItemRightCol' style={{padding: "0px"}}
					xs={12} sm={7} md={5} lg={5}>
					<p style={{paddingLeft: "0px"}}>
					{this.props.purchase.homeTeam} vs {this.props.purchase.awayTeam} <br/>
					Game Date: <Time value={this.props.purchase.date} format="MMMM D, YYYY" /> <br/>
					Tickets Sold: Section: {this.props.purchase.section}, Row: {this.props.purchase.row}, Seats: {this.getSeats()} <br/>
					Total: ${this.props.purchase.transactionTotal} <br/>
					</p>
				</Col>
			</Grid>
		);
	}

	getPurchase() {
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

	getHeader() {
		return (
			<Grid className='listingItemGrid'>
				<Col className='listingItemHeaderStatusColumn' xs={7} sm={6} md={5} lg={6}>
					<Time value={this.props.purchase.transactionDate} format="MMMM D, YYYY" />
				</Col>
				<Col className='listingItemHeaderButtonColumn' xs={5} sm={2} md={2} lg={1}>
					<Button className='listingItemButton'
						onClick={() => this.setState({ open: !this.state.open })}>
      					Order Details
    				</Button>
    			</Col>
			</Grid>
		); 
	}

	getCollapsiblePanel() {
		return (
			<Panel collapsible expanded={this.state.open} style={{marginBottom: "0px"}}>
				<h5> Order Details </h5>
	    		<p style={{paddingLeft: "0px"}}>
				Your Purchase: {this.props.purchase.seats.length} tickets @ ${this.props.purchase.price} each <br/>
				Processing Fee: ${this.props.purchase.chargesTotal} <br/>
				Transaction Total: ${this.props.purchase.transactionTotal} <br/>
				</p>
	    	</Panel>
		);
	}

	getPanel() {
		return (
			<Panel className='listingItemPanelMargins' header={this.getHeader()}>
		    	<Grid>
		    		{this.getPurchase()}
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
