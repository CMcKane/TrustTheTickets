import decode from 'jwt-decode';
import { TTTPost } from '../backend/ttt-request';

export default class AuthService {
    constructor() {
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.getToken = this.getToken.bind(this);
    }

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

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        return !!token && !this.isTokenExpired();
    }

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

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

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

    logOut() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getProfile() {
        return decode(this.getToken());
    }

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
