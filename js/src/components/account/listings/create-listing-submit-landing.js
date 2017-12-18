import React, { Component }  from 'react';
import {Grid, Well} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AuthService from '../../auth/auth-service';

/**
* This is the landing page after the user creates a new listing.
*/
export default class CreateListingSubmitLanding extends Component {

    /**
    * Constructor.
    */
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
            redirect: false
        }
    }

    /**
    * Triggered when the page loads.
    */
    componentDidMount(){
        this.timeoutHandle = setTimeout(()=>{
            this.setState({redirect: true});
        }, 5000);
    }

    /**
    * Triggered when the page un loads.
    */
    componentWillUnmount(){
        clearTimeout(this.timeoutHandle);

    }

    /**
    * Main rendering loop.
    */
    render() {
        if(this.state.redirect)
        {
            return <Redirect to={"/my-account"} />
        }
        else
        {
            return(
                <div className="globalBody globalImage">
                    <div className="globalBody globalImageOverlay">
                    <Grid style={{paddingTop: "25px", height: '80%'}}>
                        <h2>
                            <Well className='checkoutHeader'>
                                Your tickets have been listed on Trust The Tickets...Redirecting in 5 seconds.
                            </Well>
                        </h2>
                    </Grid>
                    </div>
                </div>
            );
        }
    }
}