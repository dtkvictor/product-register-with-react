import Modal, { ModalHeader } from "@/Components/Modal";
import { CategoryInterface } from "@/Context/CategoryContext";
import { uppercaseFirstLetter as upper } from '@/Helpers/StringFunctions';
import { FaTriangleExclamation, FaTrashCan } from "react-icons/fa6";
import Button from "@/Components/Button";
import { useContext, useEffect, useState } from "react";
import { CategoryContext } from "@/Context/CategoryContext";
import { AuthContext } from "@/Context/AuthContext";
import { useNavigate } from "react-router-dom";

type DeleteProps = {
    category: CategoryInterface | null,     
    clearCategory: () => void,
}

export default function Delete({ category, clearCategory}: DeleteProps): React.ReactElement {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    
    const isOpen = category ? true : false;
    const categoryContext = useContext(CategoryContext);
    const [showMessageSuccess, setStateMessageSuccess] = useState<boolean>(false);
    const [showMessageError, setStateMessageError] = useState<boolean>(false);

    function clearCategoryHandler() {
        setStateMessageSuccess(false);
        setStateMessageError(false);
        clearCategory();
    }

    function deleteCategory() {
        if(!category?.id) return;
        try {
            categoryContext?.delete(category.id)
            setStateMessageSuccess(true);
        }catch {
            setStateMessageError(true);
        }
    }

    useEffect(() => { 
        if(isOpen && !authContext?.check()) navigate('/login');
    })

    return (        
        <Modal isOpen={isOpen} closeModal={clearCategoryHandler}>
            <ModalHeader title="Delete Category" closeModal={clearCategoryHandler}/>  
            <div className="p-3">

                { showMessageSuccess && <div className='bg-green-400 rounded shadow p-3 mb-3'>Category deleted successfully!</div> }
                { showMessageError && <div className='bg-red-400 text-white rounded shadow p-3 mb-3'>Failed to delete category!</div> }

                <div className="flex flex-col w-full bg-red-300 rounded p-3"> 
                    <div className="flex items-center">
                        <FaTriangleExclamation></FaTriangleExclamation>
                        <span className="font-bold">Warning!</span>
                    </div>
                    <span>
                        Do you really want to delete the category: {upper(category?.name)}? Once this action is done, it will not be undone.
                    </span>
                </div>            
            </div>             
            
            <div className="flex justify-end p-3 pt-0">
                <Button type="danger" className="h-[34px] p-3 gap-1" onClick={deleteCategory}>
                    <span>Delete</span>    
                    <FaTrashCan></FaTrashCan>                
                </Button>
            </div>
        </Modal>
    );
}