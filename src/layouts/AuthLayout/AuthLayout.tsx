import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="bg-background-10">
            <Outlet/>
        </div>
    );
};

export default AuthLayout;