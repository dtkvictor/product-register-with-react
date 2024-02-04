import { FaTrashCan, FaPen } from "react-icons/fa6";
import { uppercaseFirstLetter } from "@/Helpers/StringFunctions";
import { ProductInterface } from "@/Context/ProdutoContext";
import Button from "@/Components/Button";

type CardProps = {        
    product: ProductInterface,
    productUpdate: (product: ProductInterface) => void,
    productDelete: (product: ProductInterface) => void,
}

export default function Card({ product, productUpdate, productDelete }: CardProps) {
    const { id, thumb, name, price, category } = product;
    
    return (
        <div className="bg-white rounded-md shadow w-full md:w-[calc(50%_-_1.25rem)] lg:w-[calc(25%_-_1.25rem)] p-2" id={`product-${id}`}>
            <div className="flex w-32 lg:w-full justify-center items-center mb-3">
                <img className="w-full aspect-square border border-neutral-500" src={thumb} alt={name} />
            </div>
            <div className="w-full font-light mb-3 truncate">
                <div className="flex flex-col mb-1">
                    <span className="text-xl">{uppercaseFirstLetter(name)}</span> 
                    <span className="text-sm">Olá mundo{uppercaseFirstLetter(typeof(category) != 'number' ? category?.name : '')}</span>
                </div>                
                <span className="text-3xl">R$ {price}</span>
            </div>
            <div className="flex justify-between items-center">
                <div className="w-full flex items-center justify-end gap-1 text-white">
                    <Button type="warning" className="p-3" onClick={() => productUpdate(product)}>
                        <FaPen></FaPen>
                    </Button>
                    <Button type="danger" className="p-3" onClick={() => productDelete(product)}>
                        <FaTrashCan></FaTrashCan>
                    </Button>
                </div>
            </div>            
        </div>
    );
}