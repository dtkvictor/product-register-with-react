import Modal, { ModalHeader } from "@/Components/Modal";
import { FaPlus } from "react-icons/fa6";
import Form from '../Partials/Form';
import { useContext, useEffect } from "react";
import Button from "@/Components/Button";
import { CategoryContext, CategoryInterface } from "@/Context/CategoryContext";
import { AuthContext } from "@/Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Create({ state, setModalState }: { state:boolean, setModalState: (state:boolean) => void }) {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const categoryContext = useContext(CategoryContext);

    function createNewCategory(category: CategoryInterface) {
        categoryContext?.insert(category);
    }
    
    useEffect(() => { 
        if(state && !authContext?.check()) navigate('/login');
    }, [state]);

    return (
        <div>
            <Modal isOpen={ state } closeModal={() => setModalState(false)}>
                <ModalHeader title="Create Category" closeModal={() => setModalState(false)}/>            
                <Form 
                    success="Category created successfully!"
                    error="Failed to create category!"
                    submit={createNewCategory} 
                    button={{
                        type:'primary', 
                        childeren:<><FaPlus></FaPlus><span>Create</span></>
                    }} 
                /> 
            </Modal>          
            <Button className="aspect-square h-[34px] rounded-full border border-neutral-400 shadow-none" onClick={() => setModalState(true)}>
                <FaPlus className="text-xl"></FaPlus>
            </Button>            
        </div>        
    );
}