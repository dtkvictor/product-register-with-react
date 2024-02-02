import { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import Button from "../Button";

export interface InputImageInterface {
    id: string,
    name?: string,
    defaultImage?: string,
    typeReturn?: 'base64'|'event',
    ref?: HTMLInputElement,
    className?: {
        img?: string,
    }
    onChange?: (event: undefined|string|React.ChangeEvent<HTMLInputElement>) => void
}

type InputImageProps = InputImageInterface;

export default function InputImage({ id, name, defaultImage, className, typeReturn, onChange}: InputImageProps):React.ReactElement {

    const [currentImage, setCurrentImage] = useState<string|undefined>();
    const inputFileRef = useRef<HTMLInputElement>(null);    

    function readAsDataURL(event: React.ChangeEvent<HTMLInputElement>):Promise<any>
    {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            
            fileReader.onload = (read) => {
                if(read.target) {
                    const urlBase64 = read.target.result as string;
                    resolve(urlBase64);                
                }
            }
            
            fileReader.onerror = (error) => {
                reject(error)
            }

            if(event.target.files?.[0]) {
                fileReader.readAsDataURL(event.target.files?.[0])
            }
        })
    }

    async function onChangeEventHandler(event: React.ChangeEvent<HTMLInputElement>) {        
        const base64 = await readAsDataURL(event);
        if(onChange) {
            if(typeReturn === 'base64') onChange(base64);
            else onChange(event);
        }
        setCurrentImage(base64);
    }

    function clear(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setCurrentImage(undefined);
        if(onChange) {
            onChange(undefined);
        }
        if(inputFileRef.current) {
            inputFileRef.current.value = "";            
        }              
    }

    useEffect(() => {
        setCurrentImage(defaultImage)
    }, [defaultImage])

    return (
        <>
            <div className="flex flex-col w-full mb-3">
                <div className="w-full flex justify-center items-center">
                    <label htmlFor={id} className="cursor-pointer rounded border border-neutral-500">
                        <img className={className?.img} src={currentImage} alt={name}/>
                    </label>
                </div>
            </div>
            <div className="flex justify-between w-full flex">
                <input 
                    ref={inputFileRef} 
                    className="w-auto cursor-pointer" 
                    id={id} 
                    name={name} 
                    type="file" 
                    accept="image/*" 
                    onChange={onChangeEventHandler}
                />
                { 
                    currentImage && 
                    <Button type="danger" className="w-24" onClick={clear}>
                        <FaTrash></FaTrash>
                    </Button>
                }
            </div>
        </>
    );
}