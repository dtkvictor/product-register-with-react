import Modal, { ModalHeader } from "@/Components/Modal";
import { uppercaseFirstLetter as upper } from '@/Helpers/StringFunctions';
import { FaTriangleExclamation, FaTrashCan } from "react-icons/fa6";
import Button from "@/Components/Button";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "@/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Alert from "@/Components/Alert";
import InputContainer, { defaultInputStyle } from "@/Components/InputContainer";


export default function DeleteAccount(): React.ReactElement {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const user = authContext?.user();
    const [state, setState] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const inputPasswordRef = useRef<HTMLInputElement>(null);

    function deleteAccount(): void
    {
        if(!(inputPasswordRef.current && inputPasswordRef.current.value)) {
            return;
        }

        authContext?.deleteAccount(inputPasswordRef.current.value)
            .then(() => navigate('/login'))
            .catch(e => setError(e.message))
    }

    return (        
        <div className="w-full flex flex-wrap justify-center bg-white rounded-md shadow p-3">
            <Modal isOpen={state}>
                <ModalHeader title="Delete Account" closeModal={() => setState(false)}/>            
                <div className="p-3">
                    <Alert type="danger" message={error}></Alert>
                    <div className="flex flex-col w-full bg-red-300 rounded p-3"> 
                        <div className="flex items-center">
                            <FaTriangleExclamation></FaTriangleExclamation>
                            <span className="font-bold">Warning!</span>
                        </div>
                        <span className="text-wrap text-ellipsis overflow-hidden">
                            Hello, {upper(user?.name)}. Do you really want to delete your account? This action cannot be undone.
                        </span>
                    </div>            
                </div>
                <div className="flex gap-1 p-3">
                    <InputContainer id="password" title="password">
                        <div className="w-full flex gap-1">
                            <input className={defaultInputStyle + ' w-full'} ref={inputPasswordRef} type="password" id="password" placeholder="Your password..."/>
                            <Button type="danger" className="h-[34px] p-3 gap-1" onClick={deleteAccount}>
                                <span>Delete</span>    
                                <FaTrashCan></FaTrashCan>                
                            </Button>
                        </div>
                    </InputContainer>
                </div>
            </Modal>
            <div className="w-full mb-1">
                <h1 className="text-xl">Delete Account</h1>
                <span>Delete your account permanently</span>
            </div>
            <div className="w-full flex justify-end gap-1 mt-3">
                <Button type="danger" className="min-w-[90px] h-[34px] p-3 gap-1" onClick={() => setState(true)}>
                    <span>Delete</span>    
                    <FaTrashCan></FaTrashCan>                
                </Button>
            </div>
        </div>
    );
}