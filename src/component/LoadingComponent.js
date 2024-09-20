import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoadingComponent = () => {
    return (
        <>
            <div className="loading">
                <h3>Loading...</h3>
            </div>
        </>
    );
};

export default LoadingComponent;