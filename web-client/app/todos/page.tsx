import { title } from "@/components/primitives";
import TodosTable from "@/components/todos-table";
import { Todo } from "./columns";

async function getTodos(): Promise<Todo[]> {
  const res = await fetch("http://localhost:5199/api/todos");
  const data = await res.json();
  return data;
}

export default async function DocsPage() {
  const todos = await getTodos();

	return (
		<div>
      <TodosTable todos={todos} />
		</div>
	);
}
