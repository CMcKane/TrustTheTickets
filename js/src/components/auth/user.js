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

export function initializeUser() {
    return ({
        'email': null,
        'id_token': localStorage.getItem('id_token'),
        'fname': null,
        'lname': null,
        'token': localStorage.getItem('id_token')
    });
}

export function getUserToken() {
    return ({
        'id_token': localStorage.getItem('id_token')
    });
}
