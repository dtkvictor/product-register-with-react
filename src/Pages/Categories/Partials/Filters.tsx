import FiltersContainer from "@/Components/Filters/FilterContainer";
import FilterByDate from "@/Components/Filters/FilterByDate";
import FilterByName from "@/Components/Filters/FilterByName";
import FilterContent from "@/Components/Filters/FilterContent";
import { defaultInputStyle } from "@/Components/InputContainer";

export default function Filters(): React.ReactElement {
    return (
        <FiltersContainer>
            <FilterByName name="name" label="Search" placeholder="Product name..."></FilterByName>
            <FilterContent name="order_by" label="Order by" defaultValue={'default'}>
                <select className={defaultInputStyle + ' w-full'}>
                    <option disabled value={'default'}>Default</option>
                    <option value={'asc'}>Ascending</option>
                    <option value={'desc'}>Descending</option>
                </select>
            </FilterContent>
            <FilterByDate name='created_at' label="Created At"></FilterByDate>
            <FilterByDate name='updated_at' label="Updated At"></FilterByDate>
        </FiltersContainer>
    );
}