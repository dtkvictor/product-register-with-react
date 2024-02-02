import { DataserviceInterface } from "./Dataservice";

type ObjectValidation = {
    value: any,
    rules: { [rule:string]: any },
    fails: { [action:string]: () => void }
    success: () => void,
}

export default class Validator 
{
    [key: string]: any;
    private validationQueue: ObjectValidation[] = [];

    constructor(validationQueue?: ObjectValidation[]) {
        if(validationQueue) {
            this.validationQueue = validationQueue
        }
    }

    private validate(): boolean
    {
        let notValid:Array<any> = [];

        this.validationQueue.forEach((validation, index) => {

            for(const rule in validation.rules) {
                const ruleParam = validation.rules[rule];
                const fails = validation.fails[rule];

                if(!this.callMethodByName(rule, [validation.value, ruleParam])) {
                    if(fails) fails();
                    return notValid[index] = true;
                }
            }
            
            if(!notValid[index] && validation['success']) {
                validation['success']();
            } 
        })

        return !(notValid.length > 0);
    }

    private callMethodByName(name:string, parameters:Array<any>)
    {
        if(name in this && typeof this[name] === 'function') { 
           return this[name](...parameters);
        }
        throw new Error("This method was not found");
    }

    public add(objectValidation:ObjectValidation): void 
    {
        this.validationQueue.push(objectValidation);
    }

    public isValid(): boolean
    {
        return this.validate();
    }

    public required(value:any):boolean 
    {
        return (value && value != null);
    }

    public min(value:string|number, min:number): boolean 
    {
        if(typeof(value) == 'string') return (value.length >= min);
        else if (typeof(value) == 'number') return (value >= min);
        return false;
    }

    public max(value:string|number, max:number):boolean
    {
        if(typeof(value) == 'string') return (value.length <= max);
        else if (typeof(value) == 'number') return (value <= max);
        return false;
    }

    public email(value: string): boolean
    {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value);
    }

    public existsOnTheDataservice(value:string|number, dataservice:DataserviceInterface[]):boolean
    {
        const data = dataservice.find(data => data.id == value);
        if(!data || data == null) return false;
        return true;
    }

    public equals(value:string|number, compare:string|number): boolean
    {
        return value == compare;
    }

    public unique(value: string, {key, dataservice, accept}: { key: string, dataservice: DataserviceInterface[], accept?:string}): boolean
    {
        const result = dataservice.find(data => {
            if(data[key] && data[key] == value && data[key] != accept) {
                return data;
            }
        });

        return result ? false : true;
    }
}