import { uppercaseFirstLetter } from "@/Helpers/StringFunctions";

export const defaultInputStyle:string = `
    p-1
    bg-white 
    rounded 
    border 
    border-solid 
    border-neutral-400       
    focus-visible:outline-none
    focus-visible:border-2
    focus-visible:border-neutral-500`;

export interface InputContainerInterface {
    id?: string,
    title?: string,
    error?: string,
    children: React.ReactElement | React.ReactElement[],
    className?: {
        container?: string,
        label?: string,
        alert?: string
    }
}

export type InputContainerProps = InputContainerInterface; 

export default function InputContainer({children, id, title, error, className}: InputContainerProps):React.ReactElement {    
    return (
        <div className={`w-full flex flex-col mb-3 ${className?.container}`}>
            <label className={className?.label} htmlFor={id}>{uppercaseFirstLetter(title)}</label>
            { children }
            <small className={`text-red-500 ${className?.alert}`}>{error}</small>
        </div>
    );
}