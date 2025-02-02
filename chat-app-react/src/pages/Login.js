import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signin.css";
re
function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!phone || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post("/login", { phone, password });

            if (response.data.success) {
                setMessage('Login successful!');
                setError('');
                navigate("/dashboard"); // Redirect to the dashboard after successful login
            } else {
                setError(response.data.message || 'Invalid phone number or password.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
            console.error('Login error:', err);
        }
    };

    return (
        <div>
            <Header />
            <div className="form-container">
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder="Enter Phone Number"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button type="submit" disabled={!phone || !password}>
                            Login
                        </button>
                    </div>
                    <a href="/signup">Don't have an account? Sign Up</a>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Login;
