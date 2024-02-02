import { FaHouse } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { Auth, AuthContext } from "@/Context/AuthContext"

interface Container {
    children: React.ReactElement|React.ReactElement[],
    title: string
}

export default function Container({children, title}: Container)
{
    const auth = new Auth();
    return (
        <div className="w-full md:w-3/6 lg:w-2/6 bg-white shadow-md rounded p-5">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl">{title}</h1>
                <Link to='/' className="text-2xl">
                    <FaHouse></FaHouse>
                </Link>
            </div>
            <AuthContext.Provider value={auth}>
                <form className="w-full h-full" onSubmit={(e) => e.preventDefault()}>
                    {children}
                </form>
            </AuthContext.Provider>
        </div>
    )
}