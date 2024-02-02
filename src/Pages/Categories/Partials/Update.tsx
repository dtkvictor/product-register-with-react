import Modal, { ModalHeader } from "@/Components/Modal";
import { FaPen } from "react-icons/fa6";
import Form from '../Partials/Form';
import { useContext, useEffect } from "react";
import { CategoryContext, CategoryInterface } from "@/Context/CategoryContext";
import { AuthContext } from "@/Context/AuthContext";
import { useNavigate } from "react-router-dom";

type UpdateProps = {
    category: CategoryInterface | null,     
    clearCategory: () => void
}

export default function Update({category, clearCategory}: UpdateProps) {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const categoryContext = useContext(CategoryContext); 
    const isOpen = category ? true : false;

    function updateCategory(category: CategoryInterface) {
        categoryContext?.update(category)
    }

    useEffect(() => { 
        if(isOpen && !authContext?.check()) navigate('/login');
    })


    return (
        <Modal isOpen={isOpen} closeModal={clearCategory}>
            <ModalHeader title="Update Category" closeModal={clearCategory}/>            
            <Form 
                category={category}
                success="Category updated successfully!"
                error="Failed to update category!"
                submit={updateCategory} 
                button={{
                    type:'warning', 
                    childeren:<><FaPen></FaPen><span>Update</span></>
                }} 
            />
        </Modal>       
    );
}