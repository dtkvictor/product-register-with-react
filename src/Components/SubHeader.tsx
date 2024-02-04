import { AuthContext } from "@/Context/AuthContext";
import { ReactElement, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function({title, className}:{title?:string, className?:string}): ReactElement 
{
    const authContext = useContext(AuthContext);
    const imgRef = useRef<HTMLImageElement>(null);
    const css = `w-full flex justify-between items-center ${className}`;
    
    useEffect(() => {
        if(imgRef.current) {
            imgRef.current.src = authContext?.user()?.profile as string;
        }
    })

    return (
        <div className={css}>
            <h1 className="text-2xl">{title}</h1>
            { authContext?.check() &&
                <Link to='/profile'>
                    <img ref={imgRef} className="bg-white rounded-full w-10 h-10 shadow border pointer"/> 
                </Link>
            }
        </div>
    )
}