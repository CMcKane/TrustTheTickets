import React, {Component} from 'react';
import {Button, Modal} from 'react-bootstrap';

/**
* This component is the checkout confirmation modal which displays after the user checks out.
*/
export default class CheckoutConfirmationModal extends Component {

    /**
    * Call to hide the modal from the web page.
    */
    onHide() {
        this.props.onHide();
    }

    /**
    * The render method performs all rendering of the web page.
    */
    render() {
        return (
            <Modal onHide={this.onHide.bind(this)}
                   show={this.props.show} bsSize="large" aria-labelledby="contained-modal-title-sm">
                <Modal.Header closeButton>
                    <Modal.Title>Purchase Complete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Your purchase is complete!</h4>
                    <p>
                        You should receive an email with your ticket PDFs shortly. 
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.props.onHide()}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
