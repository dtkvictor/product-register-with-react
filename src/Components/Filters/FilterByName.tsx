import { defaultInputStyle } from "../InputContainer";
import FilterContent from "./FilterContent";

export default function FilterBySlug({ name, label }:{ name:string, label?:string, placeholder?: string }): React.ReactNode {
    return (
        <FilterContent name={name} label={label} >
            <input 
                type="search" 
                id={name}
                name={name} 
                className={defaultInputStyle + ' w-full'}
            />   
        </FilterContent>
    );    
}

