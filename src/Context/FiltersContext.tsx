import { createContext } from "react";
import { NavigateFunction, Location } from "react-router-dom";

export class FilterHandler 
{
    private navigate: NavigateFunction;
    private queryParams: URLSearchParams;
   
    constructor (navigate: NavigateFunction, location: Location) 
    {   
        this.navigate = navigate;
        this.queryParams = new URLSearchParams(location.search);
    }

    public get(filter: string): any
    {
        return this.queryParams.get(filter);
    }

    public has(filter: string): boolean
    {
        return this.queryParams.has(filter);
    }    

    public add(filter:string, value: any)
    {
        this.queryParams.set(filter, value);
        this.navigate(`?${this.queryParams.toString()}`);
    }

    public remove(filter:string)
    {
        this.queryParams.delete(filter);
        this.navigate(`?${this.queryParams.toString()}`);
    }
}

export const FilterContext = createContext<FilterHandler|undefined>(undefined);