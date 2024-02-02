import FiltersContainer from "@/Components/Filters/FilterContainer";
import FilterByDate from "@/Components/Filters/FilterByDate";
import FilterByNumeric from "@/Components/Filters/FilterByNumeric";
import { uppercaseFirstLetter } from "@/Helpers/StringFunctions";
import FilterBySlug from "@/Components/Filters/FilterByName";
import FilterContent from "@/Components/Filters/FilterContent";
import { useContext } from "react";
import { defaultInputStyle } from "@/Components/InputContainer";
import { ProductContext } from "@/Context/ProdutoContext";

export default function Filters(): React.ReactElement {
    const productContext = useContext(ProductContext);
    const categories = productContext?.getCategories() ?? [];

    return (
        <FiltersContainer>
            <FilterBySlug name="name" label="Search" placeholder="Product name..."></FilterBySlug>
            <FilterContent name="order_by" label="Order by" defaultValue={'default'}>
                <select className={defaultInputStyle + ' w-full'}>
                    <option disabled value={'default'}>Default</option>
                    <option value={'min'}>Lowest price</option>
                    <option value={'max'}>Biggest price</option>
                </select>
            </FilterContent>
            <div className='w-full'>
                <label>{uppercaseFirstLetter('Price')}</label>
                <div className="flex gap-1">
                    <FilterByNumeric name="min" placeholder="min"></FilterByNumeric>
                    <FilterByNumeric name="max" placeholder="max"></FilterByNumeric>
                </div>
            </div>
            <FilterContent name="category" label="Category" defaultValue={'default'}>
                <select className={defaultInputStyle + ' w-full'}>
                    <option disabled value={'default'}>Default</option>
                    { categories.map(category => <option key={category.id} value={category.id as number}>{category.name}</option>) }
                </select>
            </FilterContent>
            <FilterByDate name='created_at' label="Created At"></FilterByDate>
            <FilterByDate name='updated_at' label="Updated At"></FilterByDate>
        </FiltersContainer>
    );
}