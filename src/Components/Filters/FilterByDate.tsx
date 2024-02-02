import { defaultInputStyle } from "../InputContainer";
import FilterContent from "./FilterContent";

export default function FilterByDate({ name, label }:{ name:string, label?:string }): React.ReactNode {
    return (
        <FilterContent name={name} label={label}>
            <input 
                type="date" 
                id="date" 
                name="date" 
                className={defaultInputStyle + ' w-full'}
            />   
        </FilterContent>
    );    
}

