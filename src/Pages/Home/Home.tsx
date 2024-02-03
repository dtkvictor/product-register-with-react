import Button from "@/Components/Button";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { Link } from "react-router-dom";

export default function Home(): React.ReactElement 
{
    return (
        <DefaultLayout>
            <main className="w-full h-[60%] lg:h-full flex justify-center items-center">
                <div className="flex flex-col gap-2 lg:hidden">
                    <h1 className="text-center font-bold text-5xl">Register Product</h1>
                    <span className="text-center text-xl">It's not standing still that you'll get there.</span>
                    <div className="w-full flex justify-center gap-1 mt-3">
                        <Link to='/login'>
                            <Button type="primary" className="p-3 font-bold">Sing in</Button>
                        </Link>
                        <Link to='/product'>
                            <Button type="dark" className="p-3 font-bold">View Products</Button>
                        </Link>
                    </div>
                </div>
                <div className="hidden lg:flex justify-center items-center w-full h-full relative left-[12%]">
                    <div className="flex flex-col items-center justify-center gap-2 bg-white shadow rounded-md p-5 absolute z-10 top-[20%] left-[-15%] w-[50%] h-[40%]">
                        <h1 className="text-center font-bold text-6xl">Register Product</h1>
                        <span className="text-center text-2xl">It's not standing still that you'll get there.</span>
                        <div className="w-full flex justify-center gap-1 mt-5">
                            <Link to='/login'>
                                <Button type="primary" className="p-5 font-bold text-xl">Sing in</Button>
                            </Link>
                            <Link to='/product'>
                                <Button type="dark" className="p-5 font-bold text-xl">View Products</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="w-[80%] h-[80%] rounded-md shadow shadow-neutral-500">
                        <img src="/assets/home.jpg" className="w-full h-full rounded-md"/>
                    </div>
                </div>
            </main>
        </DefaultLayout>
    );
}