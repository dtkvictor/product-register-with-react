import { ProductInterface } from "@/Context/ProdutoContext";
import InputContainer, { defaultInputStyle } from '@/Components/InputContainer';
import InputImage from '@/Components/Form/InputImage';
import { useContext, useEffect, useRef, useState } from 'react';
import Button, { ButtonInterface } from '@/Components/Button';
import { ProductContext } from '@/Context/ProdutoContext';
import { uppercaseFirstLetter } from '@/Helpers/StringFunctions';
import Validator from '@/Helpers/Validator';
import { CategoryInterface } from "@/Context/CategoryContext";
import Alert from "@/Components/Alert";
import { slug } from "@/Helpers/StringFunctions";

interface FormProductInterface {
    product?: ProductInterface | null,
    type: 'create'|'update',
    success: string,
    error: string,
    button: {
        type: ButtonInterface['type'],
        childeren: React.ReactElement | React.ReactElement[],
        className?: string
    }
}

type FormProductProps = FormProductInterface;

function getCategoryId(product: ProductInterface|null|undefined): number|undefined
{
    if(!product || typeof(product.category) != 'object') return;
    return product.category.id as number;
}

export default function Form({ type, product, button, success, error}:FormProductProps): React.ReactElement {

    const context = useContext(ProductContext);
    const categories = context?.getCategories() as CategoryInterface[];

    const inputNameRef = useRef<HTMLInputElement>(null);
    const inputPriceRef = useRef<HTMLInputElement>(null);
    const inputCategoryRef = useRef<HTMLSelectElement>(null);
    const [thumb, setThumb] = useState<string>('');
    const [ errors, setErrors ] = useState({thumb:null, name: null, price: null, category: null})
    const [messageSuccess, setMessageSuccess] = useState<string>('');
    const [messageError, setMessageError] = useState<string>('');

    function defineError(input: string, message: string) {
        setErrors(prevErrors => ({
            ...prevErrors,
            [input]: message
        }))
    }

    function validateForm({ name, price, category }: { name:string, price: number, category:number|CategoryInterface }) 
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
        const validateInputPrice = {
            value: price, 
            success: () => defineError('price', ''),
            rules: { required: true, min: 1, max: 10000 },
            fails: { 
                required: () => defineError('price', 'The price field is required.'),
                min: () => defineError('price', 'The price field requires a min value of 1.'),
                max: () => defineError('price', 'The price field requires a max value of 10000.')
            }
        }
        const validateInputCategory = {
            value: category,
            success: () => defineError('category', ''), 
            rules: { required: true, existsOnTheDataservice: categories },
            fails: { 
                required: () => defineError('category', 'The category field is required.'),
                existsOnTheDataservice: () =>  defineError('category', 'The selected category is not valid.')
            }
        }
        const validator = new Validator([
            validateInputName, 
            validateInputPrice,
            validateInputCategory
        ]);
        return validator.isValid();
    }

    function submitHandler() {

        const newObjectProduct: ProductInterface = {
            id: product?.id ?? 0,
            thumb: thumb,
            name: inputNameRef.current?.value ?? '',
            slug: slug(inputNameRef.current?.value) ?? '',
            price: parseFloat(inputPriceRef.current?.value ?? '0'),
            category: parseInt(inputCategoryRef.current?.value ?? '0'),
            created_at: product?.created_at ?? null,
            updated_at: null
        }

        if(!validateForm(newObjectProduct)) return
        
        try {
            if(type == 'create') context?.insert(newObjectProduct);
            else if(type == 'update') context?.update(newObjectProduct);
            else throw new Error('Type is not defined or is not suported') 
            setMessageSuccess(success ?? '');
        }catch (e) {
            console.error(e);
            setMessageError(error ?? '');
        }
    }

    useEffect(() => {
        if(product && inputNameRef.current && inputPriceRef.current) {
            inputNameRef.current.value = product.name;
            inputPriceRef.current.value = `${product.price}`;
        }
    }, [product])

    return (
        <form className='p-3' onSubmit={(e) => e.preventDefault()}>         
            
            <Alert type='success' message={messageSuccess} />
            <Alert type='danger' message={messageError} />         
            
            <InputContainer title='thumb' id='thumb' error={errors.thumb ?? ''}>
                <InputImage id="thumb" className={{img:'w-20 h-20'}} defaultImage={product?.thumb} typeReturn={'base64'} onChange={(base64:any) => setThumb(base64)}/>    
            </InputContainer>

            <InputContainer title='name' id='name' error={errors.name ?? ''}>
                <input ref={inputNameRef} name='name' id='name' className={defaultInputStyle}/>
            </InputContainer>

            <InputContainer title='price' id='price' error={errors.price ?? ''}>
                <input ref={inputPriceRef} type='number' name='price' step={.1} id='price' className={defaultInputStyle}/>
            </InputContainer>

            <InputContainer title='category' id='category' error={errors.category ?? ''}>
                <select ref={inputCategoryRef} className={defaultInputStyle} defaultValue={getCategoryId(product)}>
                    { categories.map((category, index) => 
                        (
                            <option key={index} value={category.id ?? 0}>
                                { uppercaseFirstLetter(category.name) }
                            </option>
                        )
                    )}
                </select>
            </InputContainer>

            <div className='w-full flex justify-end mb-1'>
                <Button type={button.type} className='w-24 gap-1 px-3 py-2' onClick={ () => submitHandler() }>
                    { button.childeren }
                </Button>                
            </div>            
        </form>
    );
}