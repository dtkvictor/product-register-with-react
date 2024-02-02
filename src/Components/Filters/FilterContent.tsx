import { FaX } from "react-icons/fa6"
import React, {  ChangeEventHandler, ForwardedRef, forwardRef, useContext, useEffect, useRef } from "react"
import InputContainer from "../InputContainer";
import Button from "../Button";
import { FilterContext } from "@/Context/FiltersContext";

type FilterContentProps = {
    children: React.ReactElement,
    name: string, 
    label?: string,
    defaultValue?: string 
}

type AddEventListenerProps = {
    children: React.ReactElement;
    event: ChangeEventHandler,
}

const AddEventListener = forwardRef(({ children, event }: AddEventListenerProps, ref: ForwardedRef<HTMLInputElement | HTMLSelectElement>) => {
    if (children && (children.type === 'input' || children.type === 'select')) {
        return React.cloneElement(children, { onChange: event, ref: ref });
    }
    return children;
})

export default function FilterContent({ children, name, label, defaultValue }:FilterContentProps): React.ReactNode {
    const handler = useContext(FilterContext);
    const ref = useRef<HTMLInputElement|HTMLSelectElement|null>(null);

    function addFilter(event: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>)
    {
        const value = event.target.value;
        if(value) handler?.add(name, value);
        else handler?.remove(name);
    }

    function clearFilter(): void
    {
        handler?.remove(name);
        if(ref?.current) {
            ref.current.value = defaultValue ?? '';
        }
    }

    useEffect(() => {
        if(ref?.current && (handler?.has(name) || defaultValue)) {
            ref.current.value = handler?.get(name) ?? defaultValue;
        }
    }, [ref])

    return (
        <InputContainer title={label}>
            <div className="w-full flex gap-1">
                <AddEventListener children={children} event={addFilter} ref={ref}/>
                { handler?.has(name) && 
                    <Button className="w-9 h-9 shadow-none border border-neutral-400" type="generic" onClick={clearFilter}>
                        <FaX></FaX>
                    </Button>
                }  
            </div>   
        </InputContainer>
    );    
}

