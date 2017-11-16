import React, {Component} from 'react';
import {TTTPost} from '../../backend/ttt-request';
import withAuth from '../../auth/with-auth';
import AuthService from '../../auth/auth-service';
import _ from 'lodash';
import ListingItem from './listing-item';
import EditListingModal from './edit-listing-modal';
import { Grid, Col } from 'react-bootstrap';
import '../../../stylesheet.css';


class ListingsView extends Component {

	constructor(props) {
		super(props);
		this.Auth = new AuthService();
		this.state = {
			listings: null,
			show: false,
			selectedListing: null,
			modalSubmitError: null
		}
	}

	componentDidMount() {
		this.getListings();
	}

	getListings() {
		TTTPost('/your-listings', {
			token: this.Auth.getToken()
		})
		.then(res => {
			if (res.data.authenticated) {
				this.setState({
					listings: res.data.listings
				});
			}
		});
	}

	onHide() {
		this.setState({
			show: false
		});
	}

	showModal(listing) {
		this.setState({
			selectedListing: listing,
			show: true
		})
	}


	submitListing(price, groupID) {
		var newListings = this.state.listings;
		var show = true;
		TTTPost('/update-listing', {
			token: this.Auth.getToken(),
			newPrice: price,
			groupID: groupID
		})
		.then(res => {
			if (res.data.authenticated) {
				newListings=res.data.listings;
				show=false;
			}
			this.setState({
				listings: newListings,
				show: show,
				modalSubmitError: true,
				busy: false
			});
		});

	}

	renderListings() {
		return _.map(this.state.listings, (listing, index) =>
            <ListingItem key={index} listing={listing} showModal={this.showModal.bind(this)} />
        );
	}

	render() {
        return (
            <div>
            	<EditListingModal listing={this.state.selectedListing}
            		modalSubmitError={this.state.modalSubmitError}
            		show={this.state.show}
            		onHide={this.onHide.bind(this)}
            		submitListing={this.submitListing.bind(this)} />
                <div style={{paddingBottom: '0px'}}>
	        		<Grid className='listingsViewGrid'>
	        			<Col xs={0} sm={1} md={2} lg={2}>
	        			</Col>
	        			<Col xs={12} sm={10} md={8} lg={8} style={{height: '100%', paddingBottom: '40px'}}>
	                		<h1 className="listingTitle listingsViewH1">
	                			Your Listing History 
	             			</h1>
	                		<div className='listingsViewTicketListingWindow' >
	                			{this.renderListings()}
	                		</div>
	                	</Col>
	                	<Col xs={0} sm={11} md={2} lg={2}>
	                	</Col>
	                </Grid>
	            </div>
	        </div>
	    );
	}
}

export default withAuth(ListingsView);
