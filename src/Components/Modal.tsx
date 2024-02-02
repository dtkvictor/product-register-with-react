import React from "react";
import Overlay from "./Overlay";
import { FaX } from "react-icons/fa6";

type callback = () => void;

type ModalHeaderProps = {
    title: String,
    closeModal: callback|React.MouseEventHandler,
}

type ModalFooterProos = {
    children: React.ReactElement | React.ReactElement[],
}

type ModalProps = {    
    children: React.ReactElement | React.ReactElement[],
    isOpen: Boolean,
    closeModal?: callback|React.MouseEventHandler
}

export function ModalHeader({ title, closeModal }: ModalHeaderProps): React.ReactElement {
    return (
        <div className="w-full min-h-[calc(3.5rem_+_4px)] p-3 flex justify-between items-center bg-neutral-300 rounded-t">
            <h1 className="text-2xl">{title}</h1>
            <button onClick={closeModal}>
                <FaX></FaX>
            </button>     
        </div>
    );
}

export function ModalFooter({ children }: ModalFooterProos): React.ReactElement {
    return (
        <div className="w-full p-3 flex justify-end items-center gap-1 border-2 border-solid border-t-neutral-300">
            { children }
        </div>
    );
}

export default function Modal({children, isOpen, closeModal }: ModalProps):React.ReactElement {
    return (
        <>
            { isOpen ?
                <Overlay className="w-full h-full flex justify-center items-start px-3 md:px-0" onClick={closeModal}>
                    <div className="w-full md:w-3/5 lg:w-2/5 bg-white rounded shadow mt-[calc(5.25rem)]">
                        { children }
                    </div>                    
                </Overlay>
            : <></> }
        </>
    )
}
