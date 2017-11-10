import React, { Component }  from 'react';
import { TTTGet } from '../backend/ttt-request';
import '../../stylesheet.css';

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
                const accounts = res.data.accounts;
                this.setState({ accounts });
            });
    }

    render() {
        return (
            <div className="centered viewAccountDiv">
                <h1 className="text-center viewAccountH1">Registered Accounts</h1>
                <table className='viewAccountTable'>
                    <tbody>
                    <tr>
                        <th>Account ID</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Creation Date</th>
                    </tr>
                    {this.state.accounts.map(account =>
                        <tr key={account.account_id}>
                            <td>{account.account_id}</td>
                            <td>{account.email}</td>
                            <td>{account.fname}</td>
                            <td>{account.lname}</td>
                            <td>{account.created_dt}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        );
    }
}