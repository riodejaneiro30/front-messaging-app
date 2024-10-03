import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import makeToast from "../Toaster";
import NavbarComponent from "../component/NavbarComponent";
import LoadingComponent from "../component/LoadingComponent";
import {Row, Col} from "react-bootstrap";
import Cookies from 'js-cookie';

const DashboardPage = ({socket, setupSocket}) => {
    const [chatrooms, setChatroom] = useState([]);
    const [userOnline, setUserOnline] = useState([]);
    const chatroomNameRef = useRef();
    const importantMessageNameRef = useRef();

    const getChatrooms = () => {
        axios.get("http://localhost:8000/chatroom", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
            .then((response) => {
                setChatroom(response.data);
            })
            .catch((err) => {
                setTimeout(() => {
                    getChatrooms();
                  }, 3000);
                console.log(err);
            })
    }

    const createChatroom = () => {
        const chatroomName = chatroomNameRef.current.value;
        axios.post("http://localhost:8000/chatroom", {
            name: chatroomName
        }, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
            .then((response) => {
                makeToast("success", response.data.message);
                getChatrooms();
                chatroomNameRef.current.value = "";
            })
            .catch((err) => {
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
        if (!socket) {
            setupSocket();
        }

        getChatrooms();
    }, [])

    const fetchOnlineUsers = () => {
        if (socket) {
            socket.emit("getOnlineUsers"); // Request online users from the server
        }
    };

    useEffect(() => {
        //console.log(socket);

        if (socket) {
            socket.on("updateOnlineUsers", (users) => {
                setUserOnline(users);

                //console.log("Online user", users);
            });

            fetchOnlineUsers();
        }

        return () => {
            if (socket) {
                socket.off("updateOnlineUsers");
            }
        };
    }, [socket, userOnline]);

    const broadcastMessage = () => {
        const message = importantMessageNameRef.current.value;

        if (socket) {
            socket.emit("importantMessage", {
                message
            });

            importantMessageNameRef.current.value = "";

            makeToast("success", "Important message sent");
        }
    };

    if (!socket) {
        return (
            <LoadingComponent />
        )
    }
    else {
        return (
                <>
                <NavbarComponent socket={socket}/>
                <div className="dashboard">
                    <div className="onlineUsers">
                        <h3>Online Users</h3>
                        <ul>
                            {userOnline.map(user => (
                                <li key={user.userId} style={{ color: 'green' }}>{user.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="cardDashboard">
                        <p style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>Chatroom</p>
                        <div className="cardBody">
                            <div className="inputGroup">
                                <label htmlFor="chatroomName">Chatroom Name</label>
                                <input type="text" name="chatroomName" id="chatroomName" placeholder="Enter your chatroom name" ref={chatroomNameRef} />
                            </div>
                            <button onClick={createChatroom}>Create Chatroom</button>
                            <div className="chatrooms">
                                {chatrooms.map((chatroom) => (
                                    <div className="chatroom" key={chatroom._id}>
                                        <p>{chatroom.name}</p>
                                        <Link to={`/chatroom/${chatroom._id}`}>
                                            <div className="join">Join</div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="cardDashboard">
                        <p style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>Announcement</p>
                        <div className="cardBody">
                            <div className="inputGroup">
                                <label htmlFor="importantMessageName">This message will broadcast to all chatroom</label>
                                <input type="text" name="importantMessageName" id="importantMessageName" placeholder="Enter your message" ref={importantMessageNameRef} />
                            </div>
                            <button onClick={broadcastMessage}>Announce</button>
                        </div>
                    </div>
                </div>
                </>
            )
    }
};

export default DashboardPage;