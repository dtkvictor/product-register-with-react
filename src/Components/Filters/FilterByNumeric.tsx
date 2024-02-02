import { defaultInputStyle } from "../InputContainer";

import FilterContent from "./FilterContent";

export default function FilterByNumeric({ name, label, placeholder }:{ name:string, label?:string, placeholder?:string }): React.ReactNode {
    return (
        <FilterContent name={name} label={label}>
            <input
                type='number' 
                name='numeric' 
                step={.1} 
                className={defaultInputStyle + ' w-full'}
                placeholder={placeholder}
            />
        </FilterContent>
    );    
}

