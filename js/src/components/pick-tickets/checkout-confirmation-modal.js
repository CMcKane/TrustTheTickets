import React, {Component} from 'react';
import {Button, Modal} from 'react-bootstrap';

export default class CheckoutConfirmationModal extends Component {

    onHide() {
        this.props.onHide();
    }

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
