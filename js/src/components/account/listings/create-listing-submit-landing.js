import React, { Component }  from 'react';
import {Grid, Well} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AuthService from '../../auth/auth-service';
import '../../../stylesheet.css';

export default class CreateListingSubmitLanding extends Component {

    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
            redirect: false
        }
    }

    componentDidMount(){
        this.timeoutHandle = setTimeout(()=>{
            this.setState({redirect: true});
        }, 5000);
    }

    componentWillUnmount(){
        clearTimeout(this.timeoutHandle);

    }

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