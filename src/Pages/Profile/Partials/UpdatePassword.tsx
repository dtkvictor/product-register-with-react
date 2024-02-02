import InputContainer, {defaultInputStyle} from "@/Components/InputContainer";
import Alert from "@/Components/Alert";
import InputImage from "@/Components/Form/InputImage";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "@/Context/AuthContext";
import Button from "@/Components/Button";
import { FaPen } from "react-icons/fa6";
import Validator from "@/Helpers/Validator";
import { UserInterface, UserModel } from "@/Context/UserContext";
import Modal, {ModalHeader} from "@/Components/Modal";
import { FaTriangleExclamation } from "react-icons/fa6";

export default function UpdatePassword(): React.ReactElement
{
    const authContext = useContext(AuthContext);
    const [errors, setErrors] = useState({ password:'', passwordConfirm: '' });
    const [state, setState] = useState<boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState<string>('');
    const [messageError, setMessageError] = useState<string>('');

    const inputPasswordRef = useRef<HTMLInputElement>(null);
    const inputPasswordConfirmRef = useRef<HTMLInputElement>(null);
    const inputCurrentPasswordRef = useRef<HTMLInputElement>(null);
    
    function defineError(input:string, message:string): void
    {
        setErrors(prevErrors => ({
            ...prevErrors,
            [input]: message
        }));
    }

    function validateForm({ password, passwordConfirm }: { password:string, passwordConfirm:string })
    {
        const validateInputPassword = {
            value: password,
            success: () => defineError('password', ''),
            rules: { required: true, min: 8, max: 255 },
            fails: { 
                required: () => defineError('password', 'The password field is required.'),
                min: () => defineError('password', 'The password field requires a min value of 8 characters.'),
                max: () => defineError('password', 'The password field requires a max value of 255 characters.')
            }
        }

        const validateInputPasswordConfirm = {
            value: passwordConfirm,
            success: () => defineError('passwordConfirm', ''),
            rules: { required: true, equals: password },
            fails: { 
                required: () => defineError('passwordConfirm', 'The password confirm field is required.'),
                equals: () => defineError('passwordConfirm', 'passwords do not match.')
            }
        }

        const validator = new Validator([
            validateInputPassword,
            validateInputPasswordConfirm
        ]);

        return validator.isValid();
    }

    function openModal(): void 
    {
        let data = {
            password: inputPasswordRef.current?.value ?? '',
            passwordConfirm: inputPasswordConfirmRef.current?.value ?? '',
        }
        if(!validateForm(data)) return;
        setState(true); 
    }

    function closeModal():void 
    {
        setMessageError('');
        setMessageSuccess('');
        setState(false);
    }

    function updatePassword(): void
    {
        let data = {
            password: inputCurrentPasswordRef.current?.value ?? '',
            newPassword: inputPasswordRef.current?.value ?? '',
        }
        authContext?.updatePassword(data)
            .then(message => setMessageSuccess(message))
            .catch(e => setMessageError(e.message))
    }
    
    return (
        <div className="w-full flex flex-wrap justify-center bg-white rounded-md shadow p-3">
            <Modal isOpen={state}>
                <ModalHeader title="Update Password" closeModal={closeModal}/>            
                <div className="p-3">
                    <Alert type="danger" message={messageError}></Alert>
                    <Alert type="success" message={messageSuccess}></Alert>

                    <div className="flex flex-col w-full bg-yellow-300 rounded p-3"> 
                        <div className="flex items-center">
                            <FaTriangleExclamation></FaTriangleExclamation>
                            <span className="font-bold">Warning!</span>
                        </div>
                        <span className="text-wrap text-ellipsis overflow-hidden">
                            For your security, you must enter your password to carry out this procedure.
                        </span>
                    </div>            
                </div>
                <div className="flex gap-1 p-3">
                    <InputContainer id="password" title="password">
                        <div className="w-full flex gap-1">
                            <input className={defaultInputStyle + ' w-full'} ref={inputCurrentPasswordRef} type="password" id="password" placeholder="Your password..."/>
                            <Button type="warning" className="h-[34px] p-3 gap-1" onClick={updatePassword}>
                                <span>Update</span>    
                                <FaPen></FaPen>                
                            </Button>
                        </div>
                    </InputContainer>
                </div>
            </Modal>
            <div className="w-full mb-1">
                <h1 className="text-xl">Update password</h1>
            </div>
            <div className="w-full lg:w-[50%] bg-neutral-300 p-3 rounded-md">
                <InputContainer id="password" title="Password" error={errors.password}>
                    <input className={defaultInputStyle} ref={inputPasswordRef} id="password" type="password"/>
                </InputContainer>
                <InputContainer id="password_confirm" title="Password Confirm" error={errors.passwordConfirm}>
                    <input className={defaultInputStyle} ref={inputPasswordConfirmRef} id="password_confirm" type="password"/>
                </InputContainer>
            </div>
            <div className="w-full flex justify-end gap-1 mt-3">
                <Button type='warning' className="min-w-[90px] h-[34px] p-3 gap-1" onClick={openModal}>
                    <span>Update</span>
                    <FaPen></FaPen>
                </Button>
            </div>
        </div>
    );
}