import { BehaviorSubject } from 'rxjs';
import { createBrowserHistory } from 'history';
import {handleResponse} from "./handle-response";

const currentUserSubject = new BehaviorSubject(getCookie('XSRF-REQUEST-TOKEN'));
const userIsAdminSubject = new BehaviorSubject(isAdmin());

export const history = createBrowserHistory();

export const authenticationService = {
    login,
    logout,
    getCookie,
    isAdmin,
    currentUser: currentUserSubject.asObservable(),
    userIsAdmin: userIsAdminSubject.asObservable(),

    get userIsAdminValue() { return userIsAdminSubject.value },
    get currentUserValue() { return currentUserSubject.value }
};

async function isAdmin(){
    await fetch("account/IsAdmin")
        .then(handleResponse)
        .then(Response => {
            userIsAdminSubject.next(Response.success);
        });
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function login(email, password) {
    let fetchConfig = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    };

    return fetch("account/login", fetchConfig)
        .then(handleResponse)
        .then(user => {
            isAdmin();
            currentUserSubject.next(getCookie('XSRF-REQUEST-TOKEN'));
            return user;
        });
}
function logout() {

    let XSRF = getCookie('XSRF-REQUEST-TOKEN');
    
    let fetchConfig = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': XSRF
        }
    };
    fetch("account/logout", fetchConfig)
        .then(handleResponse)
        .then(user => {
            document.cookie.split(";")
            .forEach(function(c) 
            { 
                document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            
            userIsAdminSubject.next(false);
            currentUserSubject.next(null);
        })
        .catch(error => console.log(error));
}

