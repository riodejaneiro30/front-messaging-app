import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";

const NavbarComponent = ({ socket }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        
        if (socket) {
            socket.disconnect();
        }

        navigate('/login');
    };

    const getUser = () => {
        const token = sessionStorage.getItem("token");

        axios.post("http://localhost:8000/user/find", {
            token
        })
        .then((response) => {
            setUser(response.data);
        }).catch((err) => {
            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
              )
              console.log("error", err.response.data.message);
        })
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <nav>
                <div style={{ color: "white" }}>
                    Chat App
                </div>
                <div className="nav-items">
                    <h4 style={{ color: "white", marginTop: "10px" }}>{user?.name}</h4>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>
        </>
    );
};

export default NavbarComponent;