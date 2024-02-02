import { DataserviceInterface } from "./Dataservice";

export interface PaginationItemsInterface {
    meta: {
        firstPage: number,
        lastPage: number,
        currentPage: number,
        totalPage: number,
    }
    items: DataserviceInterface[],
}

export default class Pagination
{
    protected itemsPerPage: number = 4;
    protected data: DataserviceInterface[] = [];
    
    constructor(data: DataserviceInterface[]) 
    {
        if(data) this.data = data;
    }

    protected currentPage(): number
    {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const page = parseInt(params.get('page') ?? '1');
        
        if(isNaN(page)) return 1;
        return page;
    }

    protected calculateIndexes(currentPage: number, totalItems: number): { startIndex:number, endIndex:number }
    {
        const indexes = {
            startIndex: (currentPage - 1) * this.itemsPerPage,
            endIndex: Math.min(currentPage * this.itemsPerPage, totalItems)
        }

        return indexes;
    }

    public getItemsFromPage(): PaginationItemsInterface
    {
        const currentPage = this.currentPage();
        const totalItems = this.data.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const { startIndex, endIndex } = this.calculateIndexes(currentPage, totalItems);
        
        return {
            meta: {
                firstPage: 1,
                lastPage: 0, 
                currentPage: currentPage,
                totalPage: totalPages,
            },
            items: this.data.slice(startIndex, endIndex)
        }
    }
}
