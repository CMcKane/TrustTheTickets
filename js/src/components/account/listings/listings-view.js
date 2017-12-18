import React, {Component} from 'react';
import {TTTPost} from '../../backend/ttt-request';
import withAuth from '../../auth/with-auth';
import AuthService from '../../auth/auth-service';
import _ from 'lodash';
import ListingItem from './listing-item';
import EditListingModal from './edit-listing-modal';
import CancelListingModal from './cancel-listing-modal';
import { Grid, Col } from 'react-bootstrap';

/**
* This is the main view used to show the listings.
*/
class ListingsView extends Component {

    /**
    * Constructor.
    */
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

    /**
    * Triggered when the page loads.
    */
	componentDidMount() {
		this.getListings();
	}

    /**
    * Backend call to retrieve all of the current listings that a particular user has.
    */
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

    /**
    * Hides the view.
    */
	onHide() {
		this.setState({
			show: false
		});
	}

    /**
    * Cancels the hiding.
    */
	onCancelHide() {
		this.setState({
			cancelShow: false
		});
	}

    /**
    * Show the modal for a particular listing.
    * @param listing - the listing to have the modal display for.
    */
	showModal(listing) {
		this.setState({
			selectedListing: listing,
			show: true
		});
	}

    /**
    * Show modal for a cancelled listing.
    * @param listing - the listing to display the modal for.
    */
	showCancelModal(listing) {
		this.setState({
			selectedListing: listing,
			cancelShow: true
		});
	}

    /**
    * Backend call to update a current listing.
    * @param price - the price change.
    * @param groupID - the listing group id shared by the tickets.
    */
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

    /**
    * Cancels a listing currently in progress.
    * @param groupID - the group id of the tickets in the listing.
    */
	cancelListing(groupID) {
		var newListings = this.state.listings;
		var cancelShow = true;
		TTTPost('/cancel-listing', {
			token: this.Auth.getToken(),
			groupID: groupID
		})
		.then(res => {
			if (res.data.authenticated) {
				newListings=res.data.listings;
				cancelShow=false;
			}
			this.setState({
				listings: newListings,
				cancelShow: cancelShow,
				busy: false
			});
		});
	}

    /**
    * Renders the listings.
    */
	renderListings() {
		return _.map(this.state.listings, (listing, index) =>
            <ListingItem key={index} listing={listing} showCancelModal={this.showCancelModal.bind(this)}
            	showModal={this.showModal.bind(this)} />
        );
	}

    /**
    * Main rendering loop.
    */
	render() {
        return (
            <div>
            	<EditListingModal listing={this.state.selectedListing}
            		modalSubmitError={this.state.modalSubmitError}
            		show={this.state.show}
            		onHide={this.onHide.bind(this)}
            		submitListing={this.submitListing.bind(this)} />
            	<CancelListingModal listing={this.state.selectedListing}
            		modalSubmitError={this.state.modalSubmitError}
            		show={this.state.cancelShow}
            		onHide={this.onCancelHide.bind(this)}
            		cancelListing={this.cancelListing.bind(this)} />
                <div style={{paddingBottom: '0px'}}>
	        		<Grid className='listingsViewGrid'>
	        			<Col xs={0} sm={1} md={1} lg={1}>
	        			</Col>
	        			<Col xs={12} sm={10} md={10} lg={10} style={{height: '100%', 
	        				paddingBottom: '40px', paddingRight: '0px', paddingLeft: '0px'}}>
	                		<h1 className="listingTitle listingsViewH1">
	                			Your Listing History 
	             			</h1>
	                		<div className='listingsViewTicketListingWindow' >
	                			{this.renderListings()}
	                		</div>
	                	</Col>
	                	<Col xs={0} sm={1} md={1} lg={1}>
	                	</Col>
	                </Grid>
	            </div>
	        </div>
	    );
	}
}

export default withAuth(ListingsView);
