import DefaultLayout from "@/Layouts/DefaultLayout"
import AuthContainer from "./Partials/AuthContainer"
import InputContainer, { defaultInputStyle } from "@/Components/InputContainer"
import InputImage from "@/Components/Form/InputImage"
import { useRef, useState } from "react"
import Button from "@/Components/Button"
import { Link } from "react-router-dom"
import Validator from "@/Helpers/Validator"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "@/Context/AuthContext"
import Alert from "@/Components/Alert"
import { UserModel } from "@/Context/UserContext"

export default function Login(): React.ReactElement 
{
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const isAuth = authContext?.check();
    
    const inputNameRef = useRef<HTMLInputElement>(null);
    const inputEmailRef = useRef<HTMLInputElement>(null);
    const inputPasswordRef = useRef<HTMLInputElement>(null);
    const inputPasswordConfirmRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<string>('');
    const [errors, setErrors] = useState({ profile:'', name:'', email:'', password:'', passwordConfirm: '',  form: ''});

    function defineError(input:string, message:string): void
    {
        setErrors(prevErrors => ({
            ...prevErrors,
            [input]: message
        }));
    }

    function validateForm({ name, email, password, passwordConfirm }: { name:string, email:string, password:string, passwordConfirm:string })
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
            rules: { required: true, min: 3, max: 355, email, unique: { key:'email', dataservice: (new UserModel()).get()}},
            fails: { 
                required: () => defineError('email', 'The email field is required.'),
                min: () => defineError('email', 'The email field requires a min value of 3 characters.'),
                max: () => defineError('email', 'The email field requires a max value of 355 characters.'),
                email: () => defineError('email', 'This email is not valid.'),
                unique: () => defineError('email', 'This email has already been registered.')
            }
        }

        const validateInputPassword = {
            value: password,
            success: () => defineError('password', ''),
            rules: { required: true, min: 8, max: 355 },
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
            validateInputName,
            validateInputEmail,
            validateInputPassword,
            validateInputPasswordConfirm
        ]);

        return validator.isValid();
    }
    
    function submitHandler():void 
    {
        let data = {
            id: null,
            profile: profile,
            name: inputNameRef.current?.value ?? '',
            email: inputEmailRef.current?.value ?? '',
            password: inputPasswordRef.current?.value ?? '',
            passwordConfirm: inputPasswordConfirmRef.current?.value ?? '',
            created_at: null,
            updated_at: null,
        }
        
        if(!validateForm(data)) return;
        
        let { passwordConfirm, ...userData} = data;

        authContext?.register({...userData})
            .then(() => {
                authContext?.attempt(userData).then(() => navigate('/profile'))
            })
            .catch(() => defineError('form', 'Unable to register this user'))
    }

    return (
        <DefaultLayout>
            <div className="w-full h-[calc(100%_-_4rem)] flex justify-center items-center">
                <AuthContainer title={ isAuth ? 'Profile' : 'Register' }>
                    <Alert type="danger" message={errors.form}/>
                    <InputContainer title='thumb' id='profile' error={errors.profile}>
                        <InputImage 
                            id="profile" 
                            className={{img:'w-20 h-20'}} 
                            typeReturn={'base64'} 
                            defaultImage={authContext?.user()?.profile}
                            onChange={(base64:any) => setProfile(base64)} 
                        />    
                    </InputContainer>
                    <InputContainer id="name" title="name" error={errors.name}>
                        <input className={defaultInputStyle} ref={inputNameRef} id="name"/>
                    </InputContainer>
                    <InputContainer id="email" title="Email" error={errors.email}>
                        <input className={defaultInputStyle} ref={inputEmailRef} id="email"/>
                    </InputContainer>
                    <InputContainer id="password" title="Password" error={errors.password}>
                        <input className={defaultInputStyle} ref={inputPasswordRef} id="password" type="password"/>
                    </InputContainer>
                    <InputContainer id="password_confirm" title="Password Confirm" error={errors.passwordConfirm}>
                        <input className={defaultInputStyle} ref={inputPasswordConfirmRef} id="password_confirm" type="password"/>
                    </InputContainer>
                    <div className="flex justify-between items-center">
                        <Link to='/login'>
                            <span className="underline text-blue-400">Already have an account?</span>
                        </Link>
                        <Button type='primary' className="px-3 py-1 w-3/6" onClick={submitHandler}>
                            Register
                        </Button>
                    </div>
                </AuthContainer>
            </div>
        </DefaultLayout>
    )
}