import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const NavbarComponent = ({ socket }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        
        if (socket) {
            socket.disconnect();
        }

        navigate('/login');
    };

    return (
        <>
            <nav>
                <div className="logo" style={{ color: "white" }}>
                    Chat App
                </div>
                <div className="nav-items">
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>
        </>
    );
};

export default NavbarComponent;