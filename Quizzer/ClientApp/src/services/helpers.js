import { BehaviorSubject } from 'rxjs';
import { createBrowserHistory } from 'history';


import {handleResponse} from "./handle-response";

const currentUserSubject = new BehaviorSubject(getCookie('XSRF-REQUEST-TOKEN'));

export const history = createBrowserHistory();

export const authenticationService = {
    login,
    logout,
    getCookie,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

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

            currentUserSubject.next(null);
        })
        .catch(error => console.log(error));
}

