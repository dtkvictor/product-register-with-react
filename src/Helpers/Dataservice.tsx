export interface DataserviceInterface {
    id: number|null,
    created_at: string|null,
    updated_at: string|null,
    [key: string]: any,
}

export default class Dataservice 
{
    protected table: string = '';
    protected cache: Array<DataserviceInterface> = [];
    protected events: { [key:string]: () => void } = {};

    constructor(table:string) 
    {
        this.table = table
        this.read()
    }
    
    private read(): void
    {
        const content = localStorage.getItem(this.table);
        if(content) this.cache = JSON.parse(content);
    }

    protected write(): void
    {
        const content = JSON.stringify(this.cache);
        localStorage.setItem(this.table, content);        
    }

    private callEvent(event: string):void 
    {
        if(this.events['global']) this.events['global']();
        if(this.events[event]) this.events[event]();
    }

    public addEventListener(event: string, callback: () => void)
    {
        this.events[event] = callback;
    }

    public removeEventListener(event: string) {
        delete this.events[event];
    }

    public find(id:number): any 
    {
        return this.cache.find(data => data.id == id);
    }

    public get(): any
    {        
        return this.cache;
    }

    public insert(data:DataserviceInterface):void
    {
        const currentDate = new Date().toDateString();

        data.id = data.id ? data.id : Math.floor(Date.now() * 1000)
        data.created_at = currentDate;
        data.updated_at = currentDate;
    
        this.cache = [data, ...this.cache];
        this.write();
        this.callEvent('insert')
    }

    public update (data:DataserviceInterface):void
    {
        data.updated_at = new Date().toDateString();

        const newDataCache = this.cache.map((object => {
            if(object.id === data.id) return data;
            return object;
        }))
        
        this.cache = [...newDataCache];
        this.write();
        this.callEvent('update')
    }

    public delete(id:number) {
        this.cache = this.cache.filter(data => data.id != id);
        this.write();
        this.callEvent('delete')
    }
}