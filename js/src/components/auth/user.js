export function login(email, fname, lname) {
    return ({
        'email': email,
        'loggedIn': true,
        'fname': fname,
        'lname': lname
    });
}

export function logout() {
    return ({
        'email': null,
        'loggedIn': false,
        'fname': null,
        'lname': null
    });
}

export function initializeUser() {
    return ({
        'email': null,
        'loggedIn': false,
        'fname': null,
        'lname': null
    });
}

