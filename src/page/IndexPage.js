import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
        else {
            navigate("/login");
        }
    }, [])

    return <div>Index Page</div>
};

export default IndexPage;