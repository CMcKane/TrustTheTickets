export function login(email) {
  return ({
    'email': email,
    'loggedIn': true
  });
}

export function logout() {
  return ({
    'email': null,
    'loggedIn': false
  });
}

export function initializeUser() {
  return ({ 
    'email': null,
    'loggedIn': false
  });
}

