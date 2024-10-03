import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const IndexPage = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

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