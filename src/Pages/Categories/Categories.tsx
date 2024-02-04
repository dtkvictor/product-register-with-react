import DefaultLayout from "@/Layouts/DefaultLayout";
import Card from "./Partials/Card";
import Create from "./Partials/Create";
import Update from "./Partials/Update";
import Delete from "./Partials/Delete";
import Pagination from "@/Components/Pagination";
import { useEffect, useState } from "react";
import { CategoryContext, CategoryModel, CategoryInterface, CategoryPaginationInterface } from "@/Context/CategoryContext";
import { useLocation } from "react-router-dom";
import SubHeader from "@/Components/SubHeader";
import Filters from "./Partials/Filters";

type CardElement = {
    categories: CategoryInterface[],
    handlerCreate: () => void,
    handlerUpdate: (category: CategoryInterface) => void, 
    handlerDelete: (category: CategoryInterface) => void, 
}

function CardElement({categories, handlerCreate, handlerUpdate, handlerDelete}: CardElement): React.ReactElement {

    if(!categories || categories.length < 1) return (
        <h1 className='text-xl'>
            <span>No categories found, do you want to </span>
            <span className='text-blue-500 cursor-pointer' onClick={handlerCreate}>
                create a new category?
            </span>
        </h1>
    );

    return (
        <div className="flex flex-wrap flex-col lg:flex-row w-full md:w-[calc(100%_-_1.25rem)]  gap-5">
            {(categories as CategoryInterface[]).map(
                category => <Card 
                                key={category.id}
                                category={category} 
                                categoryUpdate={handlerUpdate} 
                                categoryDelete={handlerDelete}
                            />
                            
            )}
        </div>
    );
}

export default function Categories(): React.ReactElement {
    const location = useLocation();
    const model = new CategoryModel();
    const fetchCategories = () => model.get(['filters', 'pagination']) as CategoryPaginationInterface;

    const [ categories, setCategories ] = useState<CategoryPaginationInterface>(fetchCategories());
    const [ stateModalCreateCategory, setStateModalCreateCategory ] = useState<boolean>(false);
    const [ categoryUpdate, setUpdateCategory ] = useState<CategoryInterface|null>(null);
    const [ categoryDelete, setDeleteCategory ] = useState<CategoryInterface|null>(null);
    
    model.addEventListener('global', () => setCategories(fetchCategories()));
    useEffect(() => setCategories(fetchCategories()), [location]); 

    return (
        <DefaultLayout>
            <CategoryContext.Provider value={model}>
                <main className="flex flex-wrap justify-center items-center gap-5 p-3 pb-5"> 
                    <SubHeader className="w-full md:w-[calc(100%_-_1.25rem)]" title="Categories" />
                    <div className='bg-white shadow p-2 w-full md:w-[calc(100%_-_1.25rem)] flex justify-between items-center rounded-md'>                    
                        <Create 
                            state={ stateModalCreateCategory } 
                            setModalState={ setStateModalCreateCategory }
                        /> 
                        <Filters></Filters>
                    </div>

                    <Update 
                        category={categoryUpdate} 
                        clearCategory={() => setUpdateCategory(null)} 
                    />
                    <Delete 
                        category={categoryDelete} 
                        clearCategory={() => setDeleteCategory(null)} 
                    />
                    <CardElement
                        categories={ categories.items }
                        handlerCreate={ () => setStateModalCreateCategory(true) }
                        handlerUpdate={ setUpdateCategory }
                        handlerDelete={ setDeleteCategory }
                    />
                    <Pagination 
                        currentPage={ categories.meta.currentPage ?? 0 }
                        totalPage={ categories.meta.totalPage ?? 0 }
                    />
                </main>
            </CategoryContext.Provider>
        </DefaultLayout>
    )
}