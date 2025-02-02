import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";

function Signup() {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profile, setProfile] = useState(null);
    const [profilePreview, setProfilePreview] = useState('/default-profile.png');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const existPhone = ['09300693294', '09154072271'];

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!phone || !name || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (existPhone.includes(phone)) {
            setError('This phone number is already registered.');
            return;
        }

        if (password !== confirmPassword) {
            setError('The password does not match the confirmation.');
            return;
        }

        const formData = new FormData();
        formData.append("phone", phone);
        formData.append("name", name);
        formData.append("password", password);
        formData.append("profile", profile);

        try {
            const response = await axios.post("/signup", formData);

            if (response.data.success) {
                setMessage('Registration successful!');
                setError('');
                navigate("/login");
            } else {
                setError(response.data.message || 'An error occurred during registration.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
            console.error('Signup error:', err);
        }
    };

    return (
        <div>
            <Header />
            <div className="form-container">
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <h1>Register</h1>
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
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
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
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 text-center">
                        <label htmlFor="profile-upload">
                            <img
                                src={profilePreview}
                                alt="Profile Preview"
                                className="profile-preview"
                            />
                        </label>
                        <input
                            type="file"
                            id="profile-upload"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleProfileChange}
                        />
                        <p className="text-muted">Click on the photo to change the image.</p>
                    </div>
                    <div>
                        <button type="submit" disabled={!phone || !name || !password || !confirmPassword}>
                            Signup
                        </button>
                    </div>
                    <a href="/login">Already have an account? Sign In</a>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Signup;
