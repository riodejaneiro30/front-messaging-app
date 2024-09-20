import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import makeToast from "../Toaster";
import NavbarComponent from "../component/NavbarComponent";
import {Row, Col} from "react-bootstrap"

const DashboardPage = ({socket, setupSocket}) => {
    const [chatrooms, setChatroom] = useState([]);
    const [userOnline, setUserOnline] = useState([]);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const chatroomNameRef = useRef();

    const getChatrooms = () => {
        axios.get("http://localhost:8000/chatroom", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
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
                Authorization: `Bearer ${localStorage.getItem("token")}`
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
        console.log(socket);

        getChatrooms();
    }, [])

    return (
        <>
        <NavbarComponent socket={socket}/>
        <div className="card">
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
        </>
    )
};

export default DashboardPage;