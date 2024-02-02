import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaList, FaUser, FaRightToBracket, FaRightFromBracket, FaBasketShopping, FaHouse} from "react-icons/fa6";
import React, { MouseEventHandler, useContext, useState } from "react";
import Overlay from '../../Components/Overlay';
import { AuthContext } from "@/Context/AuthContext";

type IfAuthRenderProps = {
    isAuth:boolean, 
    children: React.ReactElement| React.ReactElement[],
}

function IfAuthRender({isAuth, children}: IfAuthRenderProps): React.ReactElement|React.ReactElement[] 
{
    return isAuth ? children : <></>;
}

export default function Navbar() {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const isAuth = authContext?.check() ?? false;

    const [ linksState, setLinksState ] = useState<boolean>(false);
    const openLinksContainer: MouseEventHandler = ():void => { setLinksState(true) }
    const closeLinksContainer: MouseEventHandler = ():void => { setLinksState(false) }
    
    function logout(): void 
    {
        authContext?.logout(() => navigate('/login'));
    }

    return (
        <nav className="flex items-center">                    
            <button className="text-white active:scale-75" onClick={openLinksContainer}>
                <FaBars className="w-8 h-8"></FaBars>
            </button>                    
            { linksState ?
            <Overlay>
                <div className="w-full h-full" onClick={closeLinksContainer}>
                    <div className="absolute right-3 top-4 bg-white flex flex-col p-3 shadow rounded" onClick={ (e) => e.stopPropagation() }>
                        <Link to='/' className="hover:text-sky-500 flex items-center gap-1">
                            <FaHouse></FaHouse>
                            <span>Home</span>
                        </Link>
                        <Link to='/product' className="hover:text-sky-500 flex items-center gap-1">
                            <FaBasketShopping></FaBasketShopping>
                            <span>Product</span>
                        </Link>
                        <IfAuthRender isAuth={isAuth}>
                            <Link to='/category' className="hover:text-sky-500 flex items-center gap-1">
                                <FaList></FaList>
                                <span>Category</span>
                            </Link>          
                            <Link to='/profile' className="hover:text-sky-500 flex items-center gap-1">
                                <FaUser></FaUser>
                                <span>Profile</span>
                            </Link>           
                            <button className="text-red-500 hover:text-sky-500 flex items-center gap-1" onClick={logout}>
                                <FaRightFromBracket></FaRightFromBracket>
                                <span>Logout</span>
                            </button>
                        </IfAuthRender>
                        <IfAuthRender isAuth={!isAuth}>     
                            <Link to='/login' className="hover:text-sky-500 flex items-center gap-1">
                                <FaRightToBracket></FaRightToBracket>
                                <span>Login</span>
                            </Link>
                        </IfAuthRender>                                       
                    </div>
                </div>
            </Overlay>
            : <></> }
        </nav>
    );
}