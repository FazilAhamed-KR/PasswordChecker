import { useState } from 'react';
import axios from 'axios';

const PasswordChecker = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [coin, setCoin] = useState(false);

    const handlePasswordChange = (e:any) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/check-password', { password });
            setMessage(response.data.message);
        } catch (error:any) {
            setMessage(error.response?.data?.error || 'Error checking password.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Password Checker</h1>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card p-4 shadow-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Enter your password</label>
                                <div className="input-group">
                                    <input
                                        id="password"
                                        type={coin ? "text" : "password"}
                                        className="form-control"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="Your password"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        style={{ marginLeft: "5px" }}
                                        onClick={() => setCoin(!coin)}
                                    >
                                        {coin ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary">Check Password</button>
                            </div>
                        </form>
                        {message && <div className="mt-3 alert alert-info">{message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordChecker;
