import React, { Component }  from 'react';
import { TTTGet } from '../backend/ttt-request';
import '../accounts/view-account.css';

export default class ViewAccounts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accounts: []
        };
    }

    componentDidMount() {
        TTTGet("/accounts")
            .then(res => {
                console.log(res);
                const accounts = res.data.accounts;
                this.setState({ accounts });
            });
    }

    render() {
        return (
            <div class="centered" style={{width: '50%'}}>
                <h1 class="text-center">Registered Accounts</h1>
                <table style={{width: '100%'}}>
                    <tr>
                        <th>Account ID</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Creation Date</th>
                    </tr>
                    {this.state.accounts.map(account =>
                        <tr key={account.account_id}>
                            <td>{account.account_id}</td>
                            <td>{account.email}</td>
                            <td>{account.password}</td>
                            <td>{account.created_dt}</td>
                        </tr>
                    )}
                </table>
            </div>
        );
    }
}