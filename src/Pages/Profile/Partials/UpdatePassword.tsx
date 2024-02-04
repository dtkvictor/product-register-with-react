import InputContainer, {defaultInputStyle} from "@/Components/InputContainer";
import Alert from "@/Components/Alert";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "@/Context/AuthContext";
import Button from "@/Components/Button";
import { FaPen } from "react-icons/fa6";
import Validator from "@/Helpers/Validator";
import Modal, {ModalHeader} from "@/Components/Modal";

export default function UpdatePassword(): React.ReactElement
{
    const authContext = useContext(AuthContext);
    const [errors, setErrors] = useState({ password:'', passwordConfirm: '' });
    const [state, setState] = useState<boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState<string>('');
    const [messageError, setMessageError] = useState<string>('');

    const inputOldPasswordRef = useRef<HTMLInputElement>(null);
    const inputNewPasswordRef = useRef<HTMLInputElement>(null);
    const inputComfirmPasswordRef = useRef<HTMLInputElement>(null);
    
    function defineError(input:string, message:string): void
    {
        setErrors(prevErrors => ({
            ...prevErrors,
            [input]: message
        }));
    }

    function clearAllErrors()
    {
        for(let error in errors) {
            defineError(error, '')
        }    
    }

    function validateForm({ newPassword, confirmPassword }: { newPassword:string, confirmPassword:string })
    {
        const validateInputPassword = {
            value: newPassword,
            success: () => defineError('password', ''),
            rules: { required: true, min: 8, max: 255 },
            fails: { 
                required: () => defineError('password', 'The password field is required.'),
                min: () => defineError('password', 'The password field requires a min value of 8 characters.'),
                max: () => defineError('password', 'The password field requires a max value of 255 characters.')
            }
        }

        const validateInputPasswordConfirm = {
            value: confirmPassword,
            success: () => defineError('passwordConfirm', ''),
            rules: { required: true, equals: newPassword },
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

        setState(true); 
    }

    function closeModal():void 
    {
        setMessageError('');
        setMessageSuccess('');
        clearAllErrors();
        setState(false);
    }

    function updatePassword(): void
    {
        let data = {
            oldPassword: inputOldPasswordRef.current?.value ?? '',
            newPassword: inputNewPasswordRef.current?.value ?? '',
            confirmPassword: inputComfirmPasswordRef.current?.value ?? ''
        }
        
        if(!validateForm(data)) return;

        authContext?.updatePassword({password: data.oldPassword, newPassword: data.newPassword})
            .then(message => {
                setMessageError('')
                setMessageSuccess(message)
            })
            .catch(e => {
                setMessageSuccess('') 
                setMessageError(e.message)
            })
            .finally(() => {
                if(inputOldPasswordRef.current?.value) {
                    inputOldPasswordRef.current.value = ''
                }
            })
    }
    
    return (
        <div className="w-full flex flex-wrap justify-center bg-white rounded-md shadow p-3">
            <Modal isOpen={state}>
                <ModalHeader title="Update Password" closeModal={closeModal}/>            
                <div className="p-3">
                    <Alert type="danger" message={messageError}></Alert>
                    <Alert type="success" message={messageSuccess}></Alert>

                    <div className="w-full bg-neutral-300 p-3 rounded-md">
                        <InputContainer id="password" title="Password" error={errors.password}>
                            <input className={defaultInputStyle} ref={inputNewPasswordRef} id="password" type="password"/>
                        </InputContainer>
                        <InputContainer id="password_confirm" title="Password Confirm" error={errors.passwordConfirm}>
                            <input className={defaultInputStyle} ref={inputComfirmPasswordRef} id="password_confirm" type="password"/>
                        </InputContainer>
                    </div>          
                </div>
                <div className="flex gap-1 p-3">
                    <InputContainer id="password" title="password">
                        <div className="w-full flex gap-1">
                            <input className={defaultInputStyle + ' w-full'} ref={inputOldPasswordRef} type="password" id="password" placeholder="Your password..."/>
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
                <span>Update password account.</span>
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