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

export default function UpdateData(): React.ReactElement
{
    const authContext = useContext(AuthContext);
    const user = authContext?.user();
    const [errors, setErrors] = useState({ profile:'', name:'', email:'' });
    const [thumb, setThumb] = useState<string>(user?.profile ?? '');
    const [state, setState] = useState<boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState<string>('');
    const [messageError, setMessageError] = useState<string>('');

    const inputNameRef = useRef<HTMLInputElement>(null);
    const inputEmailRef = useRef<HTMLInputElement>(null);
    const inputPasswordRef = useRef<HTMLInputElement>(null);
    
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

    function validateForm({ name, email }: { name:string|undefined, email:string|undefined })
    {
        const validateInputName = {
            value: name,
            success: () => defineError('name', ''),
            rules: { required: true, min: 3, max: 355 },
            fails: { 
                required: () => defineError('name', 'The name field is required.'),
                min: () => defineError('name', 'The name field requires a min value of 3 characters.'),
                max: () => defineError('name', 'The name field requires a max value of 255 characters.'),
            }
        }

        const validateInputEmail = {
            value: email,
            success: () => defineError('email', ''),
            rules: { required: true, min: 3, max: 355, email, unique: { key:'email', dataservice: (new UserModel()).get(), accept: user?.email}},
            fails: { 
                required: () => defineError('email', 'The email field is required.'),
                min: () => defineError('email', 'The email field requires a min value of 3 characters.'),
                max: () => defineError('email', 'The email field requires a max value of 355 characters.'),
                email: () => defineError('email', 'This email is not valid.'),
                unique: () => defineError('email', 'This email has already been registered.')
            }
        }

        const validator = new Validator([
            validateInputName,
            validateInputEmail
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

    function updateData(): void
    {
        let data = {
            profile: thumb ?? user?.profile,
            name: inputNameRef.current?.value ?? user?.name,
            email: inputEmailRef.current?.value ?? user?.email,
            password: inputPasswordRef.current?.value ?? ''
        }
        if(!validateForm(data)) return;

        authContext?.updateAccount(data as UserInterface)
            .then(message => {
                setMessageError('');
                setMessageSuccess(message);
            })
            .catch(e => {
                setMessageSuccess(''); 
                setMessageError(e.message)
            })
    }

    useEffect(() => {
        if(inputNameRef.current && inputEmailRef.current) {
            inputNameRef.current.value = user?.name ?? '';
            inputEmailRef.current.value = user?.email ?? '';
        }
    }, [])
    
    return (
        <div className="w-full flex flex-wrap justify-center bg-white rounded-md shadow p-3">
            <Modal isOpen={state}>
                <ModalHeader title="Update Account Data" closeModal={closeModal}/>            
                <div className="p-3">
                    <Alert type="danger" message={messageError}></Alert>
                    <Alert type="success" message={messageSuccess}></Alert>

                    <div className="w-full bg-neutral-300 p-3 rounded-md">
                        <InputContainer title='thumb' id='profile' error={errors.profile}>
                            <InputImage 
                                id="profile" 
                                className={{img:'w-20 h-20'}} 
                                typeReturn={'base64'} 
                                defaultImage={thumb}
                                onChange={(base64:any) => setThumb(base64)} 
                            />    
                        </InputContainer>
                        <InputContainer id="name" title="name" error={errors.name}>
                            <input className={defaultInputStyle} ref={inputNameRef} id="name"/>
                        </InputContainer>
                        <InputContainer id="email" title="Email" error={errors.email}>
                            <input className={defaultInputStyle} ref={inputEmailRef} id="email"/>
                        </InputContainer>
                    </div>           
                </div>
                <div className="flex gap-1 p-3">
                    <InputContainer id="password" title="password">
                        <div className="w-full flex gap-1">
                            <input className={defaultInputStyle + ' w-full'} ref={inputPasswordRef} type="password" id="password" placeholder="Your password..."/>
                            <Button type="warning" className="h-[34px] p-3 gap-1" onClick={updateData}>
                                <span>Update</span>    
                                <FaPen></FaPen>                
                            </Button>
                        </div>
                    </InputContainer>
                </div>
            </Modal>
            <div className="w-full mb-1">
                <h1 className="text-xl">Update account data</h1>
                <span>Update your accounts profile information.</span>
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