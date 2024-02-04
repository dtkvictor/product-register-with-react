import DefaultLayout from '@/Layouts/DefaultLayout';
import Card from "./Partials/Card";
import Update from './Partials/Update';
import Delete from './Partials/Delete';
import Create from './Partials/Create';
import Pagination from '@/Components/Pagination';
import { ReactElement, useEffect, useState } from "react";
import { ProductContext, ProductModel, ProductInterface, ProductPaginationInterface } from '@/Context/ProdutoContext';
import { CategoryInterface } from '@/Context/CategoryContext';
import { useLocation } from 'react-router-dom';
import SubHeader from '@/Components/SubHeader';
import Filters from './Partials/Filters';

type CardElement = {
    products: null|undefined|ProductInterface[],
    categories: null|undefined|CategoryInterface[],
    handlerCreate: () => void,
    handlerUpdate: (product: ProductInterface) => void,
    handlerDelete: (product: ProductInterface) => void,
}

function CardElement({products, categories, handlerCreate, handlerUpdate, handlerDelete}: CardElement): React.ReactElement|ReactElement[] {

    if(!products || products.length < 1) return (
        <h1 className='text-xl'>
            <span>No products found, do you want to </span>
            <span className='text-blue-500 cursor-pointer' onClick={handlerCreate}>
                create a new product?
            </span>
        </h1>
    );
        
    const productCard:React.ReactElement[] = products.map(product => {
        let category = categories?.find(category => category.id == product.category);
        product.category = category ?? product.category;
        return (
            <Card 
                key={ product.id }
                product = { product }
                productUpdate={ handlerUpdate }
                productDelete={ handlerDelete }
            />
        )
    })

    return (
        <div className='w-full h-full flex flex-wrap justify-center gap-5'>
            {productCard}
        </div>
    );
}

export default function Products(): React.ReactElement {
    const location = useLocation();
    const productModel = new ProductModel();
    
    const fetchProducts = () => productModel.get(['filters', 'pagination']) as ProductPaginationInterface;
    
    const [ products, setProducts ] = useState<ProductPaginationInterface>(fetchProducts());
    const [ stateModalCreateProduct, setStateModalCreateProduct ] = useState<boolean>(false);
    const [ productUpdate, setUpdateProduct ] = useState<ProductInterface|null>(null);
    const [ productDelete, setDeleteProduct ] = useState<ProductInterface|null>(null);

    productModel.addEventListener('global', () => setProducts(fetchProducts()));
    useEffect(() => setProducts(fetchProducts()), [location]);

    return (
        <DefaultLayout>
            <ProductContext.Provider value = { productModel }>
                <main className="flex flex-wrap justify-center items-center gap-5 p-3 pb-5"> 
                    <SubHeader className="w-full md:w-[calc(100%_-_1.25rem)]" title="Products" />           
                    <div className='bg-white shadow p-2 w-full md:w-[calc(100%_-_1.25rem)] flex justify-between items-center rounded-md'>
                        <Create
                            state={stateModalCreateProduct}
                            setModalState={setStateModalCreateProduct} 
                        /> 
                        <Filters></Filters>
                    </div>
                    <Update product={productUpdate} clearProduct={() => setUpdateProduct(null)} />
                    <Delete product={productDelete} clearProduct={() => setDeleteProduct(null)} />

                    <CardElement 
                        products={ products.items }
                        categories={ productModel.getCategories() }
                        handlerCreate={ ()=>setStateModalCreateProduct(true) }
                        handlerUpdate={ setUpdateProduct }
                        handlerDelete={ setDeleteProduct }
                    />

                    <Pagination 
                        currentPage={ products.meta.currentPage ?? 0 }
                        totalPage={ products.meta.totalPage ?? 0 }
                    />
                    
                </main>    
            </ProductContext.Provider>
        </DefaultLayout>
    );
}