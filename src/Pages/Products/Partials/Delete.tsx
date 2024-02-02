import Modal, { ModalHeader } from "@/Components/Modal";
import { ProductInterface } from "@/Context/ProdutoContext";
import { uppercaseFirstLetter as upper } from '@/Helpers/StringFunctions';
import { FaTriangleExclamation, FaTrashCan } from "react-icons/fa6";
import Button from "@/Components/Button";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "@/Context/ProdutoContext";
import { AuthContext } from "@/Context/AuthContext";
import { useNavigate } from "react-router-dom";

type DeleteProps = {
    product: ProductInterface | null,     
    clearProduct: () => void
}

export default function Delete({ product, clearProduct }: DeleteProps): React.ReactElement {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const isOpen = product ? true : false;
    const productContext = useContext(ProductContext);
    const [showMessageSuccess, setStateMessageSuccess] = useState<boolean>(false);
    const [showMessageError, setStateMessageError] = useState<boolean>(false);

    function clearProductHandler() {
        setStateMessageSuccess(false);
        setStateMessageError(false);
        clearProduct();
    }

    function deleteProduct() {
        if(!product?.id) return;
        try {
            productContext?.delete(product.id)
            setStateMessageSuccess(true);
        }catch {
            setStateMessageError(true);
        }
    }

    useEffect(() => { 
        if(isOpen && !authContext?.check()) navigate('/login');
    })

    return (        
        <Modal isOpen={isOpen}>
            <ModalHeader title="Delete Product" closeModal={clearProductHandler}/>            
            <div className="p-3">
                
                { showMessageSuccess && <div className='bg-green-400 rounded shadow p-3 mb-3'>Product deleted successfully!</div> }
                { showMessageError && <div className='bg-red-400 text-white rounded shadow p-3 mb-3'>Failed to delete product!</div> }

                <div className="flex flex-col w-full bg-red-300 rounded p-3"> 
                    <div className="flex items-center">
                        <FaTriangleExclamation></FaTriangleExclamation>
                        <span className="font-bold">Warning!</span>
                    </div>
                    <span className="text-wrap text-ellipsis overflow-hidden">
                        Do you really want to delete the product: {upper(product?.name)}? Once this action is done, it will not be undone.
                    </span>
                </div>            
            </div>
            <form className="flex gap-1 p-3" action="">
                <div className="flex items-end pb-3">
                    <Button type="danger" className="h-[34px] p-3 gap-1" onClick={deleteProduct}>
                        <span>Delete</span>    
                        <FaTrashCan></FaTrashCan>                
                    </Button>
                </div>
            </form>
        </Modal>
    );
}