import { useState, useEffect} from "react";
import DashboardPage from "./page/DashboardPage";
import RegisterPage from "./page/RegisterPage";
import LoginPage from "./page/LoginPage";
import IndexPage from "./page/IndexPage";
import ChatroomPage from "./page/ChatroomPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./asset/css/common.css";
import "./asset/css/chatroom.css";
import io from "socket.io-client";
import makeToast from "./Toaster";

function App() {
  const [socket, setSocket] = useState(null);
  
  const setupSocket = () => {
    const token = localStorage.getItem("token");

    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
            token: localStorage.getItem("token"),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(() => {
          setupSocket();
        }, 3000);
        makeToast("error", "Connection lost. Reconnecting...");
      });

      newSocket.on("connect", () => {
        setSocket(newSocket);
        makeToast("success", "Connection established");
      });
    }
  };

  useEffect(() => {
    setupSocket();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<IndexPage />} exact/>
        <Route path="dashboard" element={<DashboardPage socket={socket} />} exact/>
        <Route path="/login" element={<LoginPage setupSocket={setupSocket} exact />} />
        <Route path="register" element={<RegisterPage />} exact />
        <Route path="chatroom/:chatroomId" element={<ChatroomPage socket={socket}/>} exact />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
