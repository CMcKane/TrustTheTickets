/**
* This function retrieves the token from local storage and sets the credentials.
* @param email - their email.
* @param fname - their first name.
* @param lname - their last name.
* @param id_token - the id of token in local storage.
*/
export function login(email, fname, lname, id_token) {
    localStorage.setItem('id_token', id_token)
    return ({
        'email': email,
        'id_token': id_token,
        'fname': fname,
        'lname': lname,
        'token': localStorage.getItem('id_token')
    });
}

/**
* Sets the values of the token to null when the user logs out.
*/
export function logout() {
    localStorage.setItem('id_token', '')
    return ({
        'email': null,
        'id_token': null,
        'fname': null,
        'lname': null,
        'token': null
    });
}

/**
* Initializes the token for the user. All values null except the token id.
*/
export function initializeUser() {
    return ({
        'email': null,
        'id_token': localStorage.getItem('id_token'),
        'fname': null,
        'lname': null,
        'token': localStorage.getItem('id_token')
    });
}

/**
* Retrieves a users token from local storage.
*/
export function getUserToken() {
    return ({
        'id_token': localStorage.getItem('id_token')
    });
}
