import Dataservice, { DataserviceInterface } from '@/Helpers/Dataservice';
import { createContext } from 'react';
import Pagination, { PaginationItemsInterface } from '@/Helpers/Pagination'; 
import { CategoryModel, CategoryInterface } from './CategoryContext';
import FilterData from '@/Helpers/FilterData';

export interface ProductInterface extends DataserviceInterface {
    name: string,
    slug: string,
    price: number,
    thumb: string,
    category: number | CategoryInterface,
}

export interface ProductPaginationInterface extends PaginationItemsInterface {
    items: ProductInterface[]
}

export type supportedMethods = "filters" | "pagination";

export interface ProductContextProps {
    addEventListener?: (event: 'global'|'insert'|'update'|'delete', callback: () => void) => void, 
    removeEventListener?: (event: 'global'|'insert'|'update'|'delete') => void,
    find: (id: number) => ProductInterface, 
    get: (withMethod?: supportedMethods[] | []) => ProductPaginationInterface | ProductInterface[],
    insert: (product: ProductInterface) => void,
    update: (product: ProductInterface) => void,
    delete: (id:number) => void,
    getCategories: () => CategoryInterface[],
}

class FilterProducts extends FilterData 
{
    protected alias(): { [key:string]: any }
    {
        const alias = {
            ...super.alias(),
            min: this.filterByMin,
            max: this.filterByMax,
            category: this.filterByCategory
        }
        return alias;
    }

    public result(): ProductInterface[] 
    {
        return this.orderBy(super.result() as ProductInterface[]);    
    }

    public filterByMin(product: ProductInterface, value: number)
    {
        return (product.price > value);
    }

    public filterByMax(product: ProductInterface, value: number)
    {
        return (product.price < value);
    }

    public filterByCategory(product: ProductInterface, categoryId: number)
    {
        return (product.category == categoryId);
    }

    public orderBy(products: ProductInterface[]): ProductInterface[]
    {
        const supported:Array<string> = ['min', 'max']
        const orderBy = this.queries.get('order_by') ?? '';
        
        if(!orderBy || !supported.includes(orderBy)) return products;
        
        products.sort((a, b) => {
            if(orderBy == 'min') return a.price - b.price;
            else return b.price - a.price;
        })
        
        return products;
    }
}

export class ProductModel extends Dataservice 
{
    private categories: CategoryInterface[] = [];

    constructor() { 
        super('products') 
        this.categories = (new CategoryModel()).get() as CategoryInterface[];
    }    

    public get(withMethod: supportedMethods[] = []): ProductPaginationInterface | ProductInterface[]
    {   
        let products = super.get();

        const supportedMethods = {
            filters: (products: ProductInterface[]) => (new FilterProducts(products)).result(),
            pagination: (products: ProductInterface[]) => (new Pagination(products)).getItemsFromPage()
        }

        for(let method of withMethod) {
            if(!supportedMethods[method]) continue; 
            products = supportedMethods[method](products);
        }

        return products;
    }
    public getCategories() { return this.categories }
    public insert(product: ProductInterface) { super.insert(product) }
    public update(product: ProductInterface) { super.update(product) }
}

export const ProductContext = createContext<ProductContextProps|undefined>(undefined);