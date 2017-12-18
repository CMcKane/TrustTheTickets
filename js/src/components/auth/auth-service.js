import decode from 'jwt-decode';
import { TTTPost } from '../backend/ttt-request';

/**
* This class is used to authenticate users upon login and handle user sessions.
*/
export default class AuthService {
    /**
    * Constructor.
    */
    constructor() {
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.getToken = this.getToken.bind(this);
    }

    /**
    * Backend call to handle when a user logs into their account.
    * @param email - their email address.
    * @param password - their password.
    */
    login(email, password) {
        // Get a token
        return TTTPost("/login", {
            email: email,
            password: password
        }).then(res => {
            if (res.data.authenticated) {
                this.setToken(res.data.token);
            }
            return Promise.resolve(res);
        });
    }

    /**
    * Checks if there is a saved token and it's still valid
    */
    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired();
    }

    /**
    * Checks to see if the token has expired or not for a user session.
    */
    isTokenExpired() {
        const token = localStorage.getItem('id_token');
        try {
            const decoded = decode(token);
            if (decoded.exp < (Date.now() / 1000)) {
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    /**
    * Creates a new user session token.
    */
    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
    }

    /**
    * Retrieves a user token.
    */
    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    /**
    * Backend call to refresh a token.
    */
    refreshToken() {
        return TTTPost("/token-refresh", {
            token: this.getToken()
        }).then(res => {
            if (res.data.authenticated) {
                this.setToken(res.data.token);
            }
            return Promise.resolve(res);
        });
    }

    /**
    * Handle when a user logs out of their account.
    */
    logOut() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    /**
    * Gets a profile from a token.
    */
    getProfile() {
        return decode(this.getToken());
    }

    /**
    * Check the status response.
    * @param response - the response.
    */
    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var error = new Error(response.statusText)
            error.response = response;
            throw error;
        }
    }
}
