import { FaSliders, FaX } from "react-icons/fa6"
import Overlay from "../Overlay"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { FilterContext, FilterHandler } from "@/Context/FiltersContext";

export default function FiltersContainer({ children }: { children: React.ReactElement| React.ReactElement[]}):React.ReactElement 
{
    const [state, setFiltersState] = useState<boolean>(false);
    const filterHandler = new FilterHandler(useNavigate(), useLocation());

    return(
        <>
            <button onClick={() => setFiltersState(true)} className="flex justify-center items-center gap-1 rounded aspect-square md:aspect-auto h-[34px] border border-neutral-400 p-0 md:p-2">
                <FaSliders></FaSliders>
                <span className="hidden md:block">Filters</span>
            </button>
            {state ?
                <Overlay onClick={() => setFiltersState(false)} className='flex justify-center'>
                    <div className="relative w-full lg:w-10/12 xl:w-8/12 h-full" onClick={() => setFiltersState(false)}>
                        <div className="absolute w-8/12 md:w-5/12 lg:w-4/12 h-3/5 top-[8.5rem] right-[.8rem] md:right-[1.35rem] lg:right-[1.4rem]"
                             onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-full h-full bg-white shadow rounded-md p-3">
                                <div className="border-b-2 border-b-neutral-300 mb-3 flex justify-between">
                                    <span>Filter by</span>
                                    <button onClick={() => setFiltersState(false)}>
                                        <FaX></FaX>
                                    </button>       
                                </div>
                                <FilterContext.Provider value={filterHandler}>                           
                                    { children }
                                </FilterContext.Provider>                                 
                            </div>                            
                        </div>                           
                    </div>
                </Overlay>
            : <></>}
        </>
    )
}