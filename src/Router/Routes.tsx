import { RouteObject } from 'react-router-dom';
import AuthMiddleware from '@/Middleware/AuthMiddleware';
import UnauthMiddleware from '@/Middleware/UnauthMiddleware';
import Products from '@/Pages/Products/Products';
import Categories from '@/Pages/Categories/Categories';
import Login from '@/Pages/Auth/Login';
import Register from '@/Pages/Auth/Register';
import Profile from '@/Pages/Profile/Profile';
import Home from '@/Pages/Home/Home';

const Routes: RouteObject[] = [
    { path: "/", element: <Home/>},
    { path: "/product", element: <Products/> },
    { path: "/category", element: <AuthMiddleware children={<Categories/>}/> },   
    { path: "/profile", element: <AuthMiddleware children={<Profile/>}/>},
    { path: "/login", element: <UnauthMiddleware children={<Login/>}/> },   
    { path: "/register", element: <UnauthMiddleware children={<Register/>}/> }, 
];

export default Routes;