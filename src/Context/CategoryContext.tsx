import { createContext } from 'react';
import Dataservice, { DataserviceInterface } from '@/Helpers/Dataservice';
import Pagination, { PaginationItemsInterface } from '@/Helpers/Pagination'; 
import FilterData from '@/Helpers/FilterData';

export interface CategoryInterface extends DataserviceInterface {
    name: string,
    slug: string,
    description: string,
}

export interface CategoryPaginationInterface extends PaginationItemsInterface {
    items: CategoryInterface[]
}

export type supportedMethods = "filters" | "pagination";

export interface CategoryContextProps {
    addEventListener: (event: 'global'|'insert'|'update'|'delete', callback: () => void) => void, 
    removeEventListener: (event: 'global'|'insert'|'update'|'delete') => void,
    find: (id: number) => CategoryInterface;
    get: (withMethod?: supportedMethods[] | []) => CategoryPaginationInterface | CategoryInterface[],
    insert: (category: CategoryInterface) => void,
    update: (category: CategoryInterface) => void,
    delete: (id:number) => void,
}


class CategoryFilters extends FilterData
{
    public result(): CategoryInterface[] 
    {
        return this.orderBy(super.result() as CategoryInterface[]);    
    }

    public orderBy(categories: CategoryInterface[]): CategoryInterface[]
    {
        const supported:Array<string> = ['asc', 'desc']
        const orderBy = this.queries.get('order_by') ?? '';
        
        if(!orderBy || !supported.includes(orderBy)) return categories;
        
        categories.sort((a, b) => {
            if(orderBy == 'asc') return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            else return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
        })
        
        return categories;
    }
}

export class CategoryModel extends Dataservice 
{
    constructor() { super('categories') }    

    public get(withMethod: supportedMethods[] = []): CategoryPaginationInterface | CategoryInterface[]
    {   
        let categories = super.get();
        const supportedMethods = {
            filters: (categories: CategoryInterface[]) => (new CategoryFilters(categories)).result(),
            pagination: (categories: CategoryInterface[]) => (new Pagination(categories)).getItemsFromPage()
        }
        for(let method of withMethod) {
            if(!supportedMethods[method]) continue; 
            categories = supportedMethods[method](categories);
        }
        return categories;
    }
    public insert(category: CategoryInterface) { super.insert(category) }
    public update(category: CategoryInterface) { super.update(category) }
}

export const CategoryContext = createContext<CategoryContextProps|undefined>(undefined);
