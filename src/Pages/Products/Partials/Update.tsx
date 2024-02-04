import Modal, { ModalHeader } from "@/Components/Modal";
import { ProductInterface } from "@/Context/ProdutoContext";
import Form from '../Partials/Form';
import { FaPen } from 'react-icons/fa6';
import { useContext, useEffect } from "react";
import { ProductContext } from "@/Context/ProdutoContext";
import { AuthContext } from "@/Context/AuthContext";
import { useNavigate } from "react-router-dom";

type UpdateProps = {
    product: ProductInterface | null,     
    clearProduct: React.MouseEventHandler
}

export default function Update({ product, clearProduct }: UpdateProps): React.ReactElement {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const isOpen = product ? true : false;

    useEffect(() => { 
        if(isOpen && !authContext?.check()) navigate('/login');
    })

    return (        
        <Modal isOpen={isOpen}>
            <ModalHeader title="Update Product" closeModal={clearProduct}/>            
            <Form 
                type="update"
                success="Success: Product updated successfully!"
                error="Error: Failed to update product!"
                product={product} 
                button={{
                    type:'warning', 
                    childeren:<><FaPen></FaPen><span>Update</span></>
                }} 
            />            
        </Modal>
    );
}