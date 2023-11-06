import TodosTable from "@/components/todos-table/todos-table";
import {Todo} from "@/components/todos-table/columns";

export default async function TodosPage() {
    return (
        <div>
            <TodosTable />
        </div>
    );
}
