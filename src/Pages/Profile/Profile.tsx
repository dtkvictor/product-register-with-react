import SubHeader from "@/Components/SubHeader";
import DefaultLayout from "@/Layouts/DefaultLayout";
import DeleteAccount from "./Partials/DeleteAccount";
import UpdateData from "./Partials/UpdateData";
import UpdatePassword from "./Partials/UpdatePassword";
import { useState } from "react";

export default function Profile(): React.ReactElement
{
    const [reload, setReload] = useState<number>(0);

    return (
        <DefaultLayout>
            <main className="flex flex-wrap justify-center items-center gap-5 p-3 pb-5"> 
                <SubHeader title="Profile"></SubHeader>
                <UpdateData reload={() => setReload(reload + 1)}></UpdateData>
                <UpdatePassword></UpdatePassword>
                <DeleteAccount></DeleteAccount>
            </main>
        </DefaultLayout>
    )
}