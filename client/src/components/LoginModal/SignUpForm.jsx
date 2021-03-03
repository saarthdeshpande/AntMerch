import {NotificationManager} from 'react-notifications';
import emailjs from 'emailjs-com';
import React, {useState} from "react";
import {TextField, Button, Select, MenuItem, InputLabel} from "@material-ui/core";

const sendMail = (name, email) => {
    const OTP = Math.floor(1000000 + Math.random() * 90000000);
    emailjs.send(process.env.REACT_APP_EMAIL_SERVICE, process.env.REACT_APP_EMAIL_TEMPLATE, { name, email, OTP }, 'user_4N9gjHghlggwrq6T5YOp1')
        .then((result) => {
            NotificationManager.success('OTP has been sent on the given email ID.', 'OTP sent!');
        }, (error) => {
            NotificationManager.error('OTP could not be sent. Please try again.', 'Error!')
            console.log(error.text);
        });
    return OTP;
}

const createUser = (user) => {
    fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(res => {
            if (res.token) {
                localStorage.setItem('token', res.token)
                localStorage.setItem('user', JSON.stringify(res.user))
                localStorage.removeItem('cart')
                window.location.reload()
            } else {
                NotificationManager.error('User already exists.', 'Failed to Create User!', 2000)
            }
        })
}

const SignUpForm = function () {
    const [OTPRequestStatus, setOTPRequestStatus] = useState(false)
    const [OTP, setOTP] = useState(null);
    const [OTPVerified, setOTPVerified] = useState(false);
    const [passwordVerified, setPasswordVerified] = useState(false);
    const [user, setUser] = useState({})
    const [addressType, setAddressType] = useState('Home')
    const [accountType, setAccountType] = useState(true)
    return (
        <>
            {!OTPVerified && <form onSubmit={async (e) => {
                e.preventDefault();
                if (OTPRequestStatus) {
                    if (OTP !== parseInt(document.getElementById('OTP').value)) {
                        setOTPRequestStatus(false);
                        NotificationManager.error('Incorrect OTP.', 'Verification Failed.', 2000)
                        setOTP(null);
                    } else {
                        setUser({
                            email: document.getElementById('email').value,
                            firstName: document.getElementById('firstName').value,
                            lastName: document.getElementById('lastName').value,
                            type: accountType
                        })
                        NotificationManager.success('', 'Verification Successful.')
                        setOTPVerified(true);
                    }
                } else {
                    setOTP(await sendMail(document.getElementById('firstName').value, document.getElementById('email').value))
                    setOTPRequestStatus(true);
                }
            }} validate="true">
                <InputLabel>Account Type</InputLabel>
                <Select
                    required
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                >
                    <MenuItem value={true}>Customer</MenuItem>
                    <MenuItem value={false}>Seller</MenuItem>
                </Select>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    type={'text'}
                    label="First Name"
                    inputProps={{
                        pattern: "^[A-Za-z]+"
                    }}
                    name="firstName"
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    type={'text'}
                    inputProps={{
                        pattern: "^[A-Za-z]+"
                    }}
                    label="Last Name"
                    name="lastName"
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    type={'email'}
                    label="Email ID"
                    name="email"
                    onChange={setOTPRequestStatus.bind(this, false)}
                    autoFocus
                />
                {!OTPRequestStatus && <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    type={'submit'}
                >
                    Get OTP
                </Button>}
                {OTPRequestStatus && (
                    <>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="OTP"
                            label="OTP"
                            type="number"
                            inputProps={{
                                minLength: 8,
                                maxLength: 8
                            }}
                            id="OTP"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            type={'submit'}
                        >
                            Verify OTP
                        </Button>
                    </>
                )}
            </form>}
            {OTPVerified && !passwordVerified &&
            <form onSubmit={async (e) => {
                e.preventDefault();
                if (document.getElementById('password').value !== document.getElementById('re_password').value) {
                    NotificationManager.error('Passwords do not match.', 'Error!', 2000)
                    setPasswordVerified(false);
                } else {
                    setUser({
                        ...user,
                        password: document.getElementById('password').value
                    })
                    setPasswordVerified(true)
                }
            }} validate="true">
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    inputProps={{
                        minLength: 8,
                        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$"
                    }}
                    id="password"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Confirm Password"
                    type="password"
                    inputProps={{
                        minLength: 8,
                        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$"
                    }}
                    id="re_password"
                />
                <p style={{ textAlign: 'center' }} className="text-muted">
                    8-12 characters with at least  1 Uppercase, Lowercase, Number and Symbol each.
                    <br/>
                    Allowed Symbols include !@#$%^&*_=+-
                </p>
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    type={'submit'}
                >
                    Proceed
                </Button>
            </form>}
            {OTPVerified && passwordVerified && (
                <form onSubmit={async e => {
                    e.preventDefault()
                    setUser({
                        ...user,
                        address: {
                            addressLine: document.getElementById('addressLine').value,
                            city: document.getElementById('city').value,
                            state: document.getElementById('state').value,
                            country: document.getElementById('country').value,
                            pinCode: document.getElementById('pinCode').value
                        }
                    })
                    await createUser(user);
                }}>
                    <InputLabel>Address Type</InputLabel>
                    <Select
                        id="addressType"
                        value={addressType}
                        onChange={(e) => setAddressType(e.target.value)}
                    >
                        <MenuItem value={'Home'}>Home</MenuItem>
                        <MenuItem value={'Office'}>Office</MenuItem>
                        <MenuItem value={'Other'}>Other</MenuItem>
                    </Select>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="addressLine"
                        label="Address Line"
                        type="text"
                        inputProps={{
                            minLength: 8,
                        }}
                        id="addressLine"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="city"
                        label="City"
                        type="text"
                        inputProps={{
                            pattern: '^[A-Z a-z]+'
                        }}
                        id="city"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="state"
                        label="State"
                        type="text"
                        inputProps={{
                            pattern: '^[A-Z a-z]+'
                        }}
                        id="state"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="country"
                        label="Country"
                        type="text"
                        inputProps={{
                            pattern: '^[A-Z a-z]+'
                        }}
                        id="country"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="pinCode"
                        label="Pincode"
                        type="text"
                        inputProps={{
                            pattern: '^[A-Z a-z 0-9]+'
                        }}
                        id="pinCode"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type={'submit'}
                    >
                        Create Account
                    </Button>
                </form>
            )}
        </>
    )
}

export default SignUpForm;