import Modal, { ModalHeader } from "@/Components/Modal";
import { FaPlus } from "react-icons/fa6";
import Form from '../Partials/Form';
import { useContext, useEffect, useState } from "react";
import Button from "@/Components/Button";
import { AuthContext } from "@/Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Create({ state, setModalState }: { state:boolean, setModalState: (state:boolean) => void }) 
{
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => { 
        if(state && !authContext?.check()) navigate('/login');
    }, [state])

    return (
        <div>
            <Modal isOpen={state}>
                <ModalHeader title="Create Product" closeModal={() => setModalState(false)}/>            
                <Form 
                    type="create"
                    success="Success: Product register successfully."
                    error="Error: Failed to register product." 
                    button={{
                    type:'primary', 
                    childeren:<><FaPlus></FaPlus><span>Create</span></>
                }} /> 
            </Modal>          
            <Button className="aspect-square h-[34px] rounded-full border border-neutral-400 shadow-none" onClick={() => setModalState(true)}>
                <FaPlus className="text-xl"></FaPlus>
            </Button>            
        </div>        
    );
}