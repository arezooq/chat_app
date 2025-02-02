import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Signin() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (phone && password) {
            setMessage('Login successful');
            setError('');
        } else {
            setError('Please fill in all fields.');
        }
    };

    return (
        <div>
            <div className="d-grid justify-content-center mt-3 mx-auto">
                <Header />
            </div>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1 className="d-grid gap-2 col-6 mx-auto align-items-center mt-5">Login</h1>
            <form onSubmit={handleSubmit} 
            className="d-grid gap-2 col-6 mx-auto align-items-center mt-5">
                <div className="mb-3 mt-3">
                    <input
                    type="text"
                    className="form-control"
                    name="phone"
                    id="phone"
                    placeholder="Enter Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    />
                </div>
                <div className="mb-3 mt-3">
                    <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3 mx-auto">
                    <button
                    type="submit"
                    className="btn btn-primary"
                    id="login"
                    disabled={!phone || !password}
                    >
                        Signin
                    </button>
                    <a className="btn btn-primary" href="/register" role="button">
                        Signup
                    </a>
                </div>
            </form>
            <div className="d-grid justify-content-center mt-3 mx-auto">
                <Footer />
            </div>
        </div>
    )
}

export default Signin;