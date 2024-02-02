import { useEffect, useRef, useState } from 'react';
import { CategoryInterface } from '@/Context/CategoryContext';
import InputContainer, { defaultInputStyle } from '@/Components/InputContainer';
import Button, { ButtonInterface } from '@/Components/Button';
import Validator from '@/Helpers/Validator';
import Alert from '@/Components/Alert';
import { slug } from '@/Helpers/StringFunctions';

interface FormCategoryInterface {
    category?: CategoryInterface | null,
    success?: string, 
    error?: string,
    button: {
        type: ButtonInterface['type'],
        childeren: React.ReactElement | React.ReactElement[],
        className?: string
    },
    submit: (category: CategoryInterface) => void,
}

type FormCategoryProps = FormCategoryInterface; 

export default function Form({ category, button, success, error, submit}:FormCategoryProps): React.ReactElement 
{
    const [messageSuccess, setMessageSuccess] = useState<string>('');
    const [messageError, setMessageError] = useState<string>('');
    const [errors, setErrors] = useState({ name: '', description: '' });
    const inputNameRef = useRef<HTMLInputElement>(null);
    const inputDescriptionRef = useRef<HTMLTextAreaElement>(null);

    function defineError(input: string, message: string) 
    {
        setErrors(prevErrors => ({
            ...prevErrors,
            [input]: message
        }))
    }

    function validateForm({ name, description }: { name:string, description: string }) 
    {
        const validateInputName = {
            value: name,
            success: () => defineError('name', ''),
            rules: { required: true, min: 3, max: 355 },
            fails: { 
                required: () => defineError('name', 'The name field is required.'),
                min: () => defineError('name', 'The name field requires a min value of 3 letters.'),
                max: () => defineError('name', 'The name field requires a max value of 255 letters.')
            }
        }
        const validateInputDescription = {
            value: description,
            success: () => defineError('description', ''),
            rules: { required: true, min: 3, max: 500 },
            fails: { 
                required: () => defineError('description', 'The description field is required.'),
                min: () => defineError('description', 'The description field requires a min value of 3 letters.'),
                max: () => defineError('description', 'The description field requires a max value of 255 letters.')
            }
        }
        const validator = new Validator([
            validateInputName, 
            validateInputDescription
        ]);
        return validator.isValid();
    }

    function submitHandler() {
        
        const newObjectCategory: CategoryInterface = {
            id: category?.id ?? 0,
            name: inputNameRef.current?.value ?? '',
            slug: slug(inputNameRef.current?.value) ?? '',
            description: inputDescriptionRef.current?.value ?? '',
            created_at: category?.created_at ?? null,
            updated_at: null
        }
        
        if(!validateForm(newObjectCategory)) return;

        try {
            submit(newObjectCategory);
            setMessageSuccess(success ?? '');
        }catch (e) {
            console.error(e);
            setMessageError(error ?? '');
        }
    }

    useEffect(() => {
        if(category && inputNameRef.current && inputDescriptionRef.current){
            inputNameRef.current.value = category.name ?? '';
            inputDescriptionRef.current.value = category.description ?? '';
        }
    }, [category]);

    return (
        <form className='p-3' onSubmit={(e) => e.preventDefault()}>   
            <Alert type='success' message={messageSuccess} />
            <Alert type='danger' message={messageError} />
            
            <InputContainer id='name' title='name' error={errors.name}>
                <input ref={inputNameRef} type="text" className={defaultInputStyle}/> 
            </InputContainer>
            <InputContainer id='description' title='description' error={errors.description}>
                <textarea ref={inputDescriptionRef} id="description" className={defaultInputStyle}>
                </textarea>
            </InputContainer>
            <div className='w-full flex justify-end mb-1'>
                <Button type={button.type} className='w-24 gap-1 px-3 py-2' onClick={ submitHandler }>
                    { button.childeren }
                </Button>                
            </div>            
        </form>
    );
}