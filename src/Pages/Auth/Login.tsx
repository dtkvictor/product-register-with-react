import DefaultLayout from "@/Layouts/DefaultLayout"
import AuthContainer from "./Partials/AuthContainer"
import InputContainer, { defaultInputStyle } from "@/Components/InputContainer"
import { useContext, useEffect, useRef, useState } from "react"
import Button from "@/Components/Button"
import { Link, useNavigate } from "react-router-dom"
import Validator from "@/Helpers/Validator"
import { AuthContext } from "@/Context/AuthContext"
import Alert from "@/Components/Alert"

export default function Login(): React.ReactElement 
{
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const inputEmailRef = useRef<HTMLInputElement>(null);
    const inputPasswordRef = useRef<HTMLInputElement>(null);

    const [errors, setErrors] = useState({email:null, password:null, form: null});

    function defineError(input:string, message:string): void
    {
        setErrors(prevErrors => ({
            ...prevErrors,
            [input]: message
        }));
    }

    function validateForm({email, password}: {email:string, password:string})
    {
        const validateInputEmail = {
            value: email,
            success: () => defineError('email', ''),
            rules: { required: true, min: 3, max: 355 },
            fails: { 
                required: () => defineError('email', 'The email field is required.'),
                max: () => defineError('email', 'The email field requires a max value of 255 characters.'),
                email: () => defineError('email', 'This email is not valid.')
            }
        }

        const validateInputPassword = {
            value: password,
            success: () => defineError('password', ''),
            rules: { required: true, min: 3, max: 355 },
            fails: { 
                required: () => defineError('password', 'The password field is required.'),
                min: () => defineError('password', 'The password field requires a min value of 8 characters.'),
                max: () => defineError('password', 'The password field requires a max value of 255 characters.')
            }
        }

        const validator = new Validator([
            validateInputEmail,
            validateInputPassword
        ]);

        return validator.isValid();
    }
    
    function submitHandler():void 
    {
        const data = {
            email: inputEmailRef.current?.value ?? '',
            password: inputPasswordRef.current?.value ?? ''
        }
        if(!validateForm(data)) return;
        authContext?.attempt(data)
            .then(() => navigate('/product'))
            .catch(() => defineError('form', 'Invalid email or password.'))
    }

    useEffect(() => {
        if(inputEmailRef.current && inputPasswordRef.current) {
            inputEmailRef.current.value = 'admin@super.com';
            inputPasswordRef.current.value = 'senha123';
        }
    }, []);

    return (
        <DefaultLayout>
            <div className="w-full h-[calc(100%_-_4rem)] flex justify-center items-center">
                <AuthContainer title="Login">

                    <Alert type="danger" message={errors.form}/>
                    
                    <InputContainer id="email" title="Email" error={errors.email ?? ''}>
                        <input className={defaultInputStyle} ref={inputEmailRef} id="email" autoComplete="email"/>
                    </InputContainer>
                    <InputContainer id="password" title="Password" error={errors.password ?? ''}>
                        <input className={defaultInputStyle} ref={inputPasswordRef} id="password" type="password" autoComplete="current-password"/>
                    </InputContainer>
                    <div className="flex justify-between items-center">
                        <Link to={'/register'}>
                            <span className="underline text-blue-400">Create account</span>
                        </Link>

                        <Button type='primary' className="px-3 py-1 w-3/6" onClick={submitHandler}>
                            Login
                        </Button>
                    </div>
                </AuthContainer>
            </div>
        </DefaultLayout>
    )
}