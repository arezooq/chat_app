import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Signup() {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profile, setProfile] = useState('null');
    const [profilePreview, setProfilePreview] = useState('/default-profile.png');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const existPhone = ['09300693294', '09154072271']

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!phone || !name || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (existPhone.includes(phone)) {
            setError('This phone number is already.');
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

        console.log("Data submitted:", Object.fromEntries(formData()));
        


        setMessage('Register successful.');
        setError('')
        
    };

    return (
        <div>
            <div className="d-grid justify-content-center mt-3 mx-auto">
                <Header />
            </div>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1 className="d-grid gap-2 col-6 mx-auto align-items-center mt-5">Register</h1>
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
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    placeholder="Enter Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
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
                <div className="mb-3 mt-3">
                    <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Enter Confirm Password"
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
                    // value={profile}
                    onChange={handleProfileChange}
                    />
                    <p className="text-muted">Click on the photo to change the image.</p>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3 mx-auto">
                    <button
                    type="submit"
                    className="btn btn-primary"
                    id="login"
                    disabled={!phone || !name || !password || !confirmPassword}
                    >
                        Signup
                    </button>
                    <a className="btn btn-primary" href="/login" role="button">
                        Signin
                    </a>
                </div>
            </form>
            <div className="d-grid justify-content-center mt-3 mx-auto">
                <Footer />
            </div>
            <style>{`
                .profile-preview {
                    width: 120px;
                    height: 120px;
                    border-redius: 50%;
                    object-fit: cover;
                    border: 2px solid #ccc;
                    cursor: pointer;

                }
            `}</style>
        </div>
    )
}

export default Signup;