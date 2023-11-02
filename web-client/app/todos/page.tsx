import TodosTable from "@/components/todos-table/todos-table";
import {Todo} from "@/components/todos-table/data";

async function getTodos(): Promise<Todo[]> {
    const res = await fetch("http://localhost:5199/api/todos");
    return await res.json();
}

export default async function TodosPage() {
    const todos = await getTodos();
    return (
        <div>
            <TodosTable todos={todos} />
        </div>
    );
}
