import React from "react";
import { NotificationManager } from "react-notifications";
import { TextField, Button } from "@material-ui/core";


const loginRequest = (email, password) => {
    return fetch('/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.token) {
                localStorage.setItem('token', res.token)
                localStorage.setItem('user', JSON.stringify(res.user))
                localStorage.removeItem('cart')
                window.location.reload()
            } else {
                NotificationManager.error('Incorrect credentials.', 'Login Failed', 2000)
            }
        })
}

const LoginForm = () => {
    return (
        <>
            <form onSubmit={async (e) => {
                e.preventDefault();
                await loginRequest(document.getElementById('email').value, document.getElementById('password').value)
            }} validate="true" >
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    type={'email'}
                    label="Email ID"
                    name="email"
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type={'submit'}
                >
                    Sign In
                </Button>
            </form>
        </>
    )
}

export default LoginForm;