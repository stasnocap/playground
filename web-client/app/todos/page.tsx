import TodosTable from "@/components/todos-table/todos-table";
import {getServerSession} from "next-auth";

export default async function TodosPage() {
    const session = await getServerSession()

    return (
        <div>
            <TodosTable />
        </div>
    );
}
