import { AuthContext } from "@/Context/AuthContext";
import { ReactElement, useContext } from "react";
import { Navigate } from "react-router-dom";

export default function AuthMiddleware({children}:{children:ReactElement}): ReactElement 
{
    const auth = useContext(AuthContext);
    if(auth?.check()) return children;
    return <Navigate to='/login' replace />;
}