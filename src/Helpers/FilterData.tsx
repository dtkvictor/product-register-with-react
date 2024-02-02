import { DataserviceInterface } from './Dataservice';

export default class FilterData
{
    protected queries = (new URL(window.location.href)).searchParams;
    protected data:DataserviceInterface[] = [];

    constructor(data:DataserviceInterface[]) {
        this.data = data;
    }

    protected alias(): { [key:string]: Function }
    {
        return {
            name: this.filterByName,
            created_at: this.filterByCreatedAt,
            updated_at: this.filterByUpdatedAt,
        }
    }

    protected callMethodByAlias(name:string)
    {   
        const alias = this.alias();
        if(!alias[name]) return;
        const method = alias[name];
        return method;
    }

    public result()
    {
        const methods:Function[] = [];
        const params:any = [];

        this.queries.forEach((value, key) => {
            const method = this.callMethodByAlias(key)
            if(!method) return; 
            methods.push(method);
            params.push(value);
        });

        if(methods.length < 1) return this.data;
     
        return this.data.filter(item => {
            const testResult:boolean = methods.every((method, index) => method(item, params[index])); 
            if(testResult) return item;
        });
    }

    public filterByName(item:DataserviceInterface, search: string): boolean
    {
        const name = (item.name as string).toLocaleLowerCase();
        return name.includes(search.toLocaleLowerCase());
    }

    public filterByCreatedAt(item:DataserviceInterface, date: string): boolean
    {
        const itemDate = new Date(item.created_at as string);
        const compareDate = new Date(date);

        return (
            (itemDate.getDay() == compareDate.getDay()) &&
            (itemDate.getDate() == compareDate.getDate()) &&
            (itemDate.getFullYear() == compareDate.getFullYear())
        );
    }

    public filterByUpdatedAt(item:DataserviceInterface, date: string): boolean
    {
        const itemDate = new Date(item.updated_at as string);
        const compareDate = new Date(date);

        return (
            (itemDate.getDay() == compareDate.getDay()) &&
            (itemDate.getDate() == compareDate.getDate()) &&
            (itemDate.getFullYear() == compareDate.getFullYear())
        );
    }
}