import { FaTrashCan, FaPen } from "react-icons/fa6";
import { uppercaseFirstLetter } from "@/Helpers/StringFunctions";
import { CategoryInterface } from "@/Context/CategoryContext";
import Button from "@/Components/Button";

type CardProps = {        
    category: CategoryInterface, 
    categoryUpdate: (category: CategoryInterface) => void,
    categoryDelete: (category: CategoryInterface) => void,
}

export default function Card({ category, categoryUpdate, categoryDelete }: CardProps) 
{
    return (
        <div className="overflow-hidden flex flex-1 justify-between bg-white rounded-md shadow p-2 min-w-[30%] max-w-full" id={`category-${category.id}`}>
            <div className="font-light me-2 overflow-hidden">
                <div className="flex flex-col mb-1">
                    <span className="w-full text-xl">{uppercaseFirstLetter(category.name)}</span> 
                </div>
                <span className="font-light text-ellipsis overflow-hidden">{category.description}</span>
            </div>         
            <div className="flex flex-col gap-2 text-white">
                <Button type="warning" className="p-3" onClick={() => categoryUpdate(category)}>
                    <FaPen></FaPen>
                </Button>
                <Button type="danger" className="p-3" onClick={() => categoryDelete(category)}>
                    <FaTrashCan></FaTrashCan>
                </Button>
            </div>
        </div>
    );
}