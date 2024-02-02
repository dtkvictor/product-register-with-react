import Navbar from "./Partials/Navbar";

type Component = {
    children: React.ReactNode,
}

export default function DefaultLayout({ children }: Component) {
    return (
        <>
            <header className="w-100 h-16 bg-rose-400 flex justify-between items-center p-3">
                <span className="text-white text-2xl md-text-3xl font-bold">Register Products</span>                
                <Navbar></Navbar>
            </header>   
            <div id="container " className="w-full min-h-[calc(100%_-_4rem)] flex justify-center bg-neutral-200 shadow-inner shadow-neutral-400">
                <div className="w-full lg:w-10/12 xl:w-8/12">
                    { children }      
                </div>                
            </div>                                 
        </>
    );
}