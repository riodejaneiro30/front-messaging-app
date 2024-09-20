import { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import NavbarComponent from "../component/NavbarComponent";
import LoadingComponent from "../component/LoadingComponent";

const ChatroomPage = ({socket, setupSocket}) => {
    const { chatroomId } = useParams();
    const [messages, setMessages] = useState([]);
    const messageRef = useRef();
    const [chatroomDetail, setChatroomDetail] = useState(null);
    const [dateTime, setDateTime] = useState(new Date());

    const formattedTime = dateTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 'true' for 12-hour format with AM/PM
    });

    const sendMessage = () => {
        if (socket) {
            const message = messageRef.current.value;
            socket.emit("chatroomMessage", {
                chatroomId,
                message,
            });

            messageRef.current.value = "";
        }
    };

    useEffect(() => {
        axios.get(`http://localhost:8000/chatroom/${chatroomId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => {
            setChatroomDetail(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        console.log(socket);

        if (!socket) {
            setupSocket();
        }
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on("receiveMessage", (data) => {
                setMessages([...messages, data]);

                console.log(messages);
            });
        }
    }, [messages]);

    useEffect(() => {
        if (socket) {
            socket.emit("joinChatroom", {
                chatroomId,
            });
        }
        
        return () => {
            if (socket) {
                socket.emit("leaveChatroom", {
                    chatroomId,
                });
            }
        }
    }, []);

    if (!socket) {
        return (
            <LoadingComponent />
        )
    }
    else {
        return (
            <>
            <NavbarComponent />
            <div className="chatroomPage">
                <div className="chatroomSection">
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>Chatroom {chatroomDetail?.name}</p>
                    <div className="chatroomContent">
                        {messages.map((message, index) => (
                            <div className="message" key={index}>
                                <span className="otherMessage">{formattedTime} {message.name} : </span> {message.message}
                            </div>
                        ))}
                    </div>
                    <div className="chatroomActions">
                        <div>
                            <input type="text" name="message" placeholder="Type message..." ref={messageRef}/>
                        </div>
                        <button className="join" onClick={sendMessage}>Join</button>
                    </div>
                    
                </div>
    
            </div>
            </>
        );
    }
};

export default ChatroomPage;