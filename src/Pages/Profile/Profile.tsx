import SubHeader from "@/Components/SubHeader";
import DefaultLayout from "@/Layouts/DefaultLayout";
import DeleteAccount from "./Partials/DeleteAccount";
import UpdateData from "./Partials/UpdateData";
import UpdatePassword from "./Partials/UpdatePassword";

export default function Profile(): React.ReactElement
{
    return (
        <DefaultLayout>
            <main className="flex flex-wrap justify-center items-center gap-5 p-3 pb-5"> 
                <SubHeader title="Profile"></SubHeader>
                <UpdateData></UpdateData>
                <UpdatePassword></UpdatePassword>
                <DeleteAccount></DeleteAccount>
            </main>
        </DefaultLayout>
    )
}