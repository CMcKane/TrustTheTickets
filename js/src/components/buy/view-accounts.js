import React, { Component }  from 'react';
import { TTTGet } from '../backend/ttt-request';

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
            <div>
                <table>
                    <tr>
                        <td>Account ID</td>
                        <td>Email</td>
                        <td>Password</td>
                        <td>Timestamp</td>
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