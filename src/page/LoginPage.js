import { createRef, useState, useEffect } from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const LoginPage = ({ setupSocket }) => {
    const navigate = useNavigate();

    const emailRef = createRef();
    const passwordRef = createRef();

    const [isSocketConnected, setIsSocketConnected] = useState(false);

    const loginUser = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios.post("http://localhost:8000/user/login", {
            email,
            password
        })
        .then((response) => {
            sessionStorage.setItem("token", response.data.token);

            makeToast("success", response.data.message);
            setupSocket(() => {
                setIsSocketConnected(true);
            });
        }).catch((err) => {
            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
              )
                makeToast("error", err.response.data.message);
        })
    }

    useEffect(() => {
        if (isSocketConnected) {
            navigate("/dashboard");
        }
    }, [isSocketConnected, navigate]);

    return (
        <div className="card">
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>Login</p>
            <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="Enter your email" ref={emailRef} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="Enter your password" ref={passwordRef} />
                </div>
                <button onClick={loginUser}>Login</button>
                <p style={{ textAlign: "center" }}>Don't have an account? <a href="/register" style={{ color: "#7C93C3" }}>Register</a></p>
            </div>
        </div>
    )
};

export default LoginPage;