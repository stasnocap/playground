export type Todo = {
    id: number,
    text: string,
    completed: boolean
}

export const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "TEXT", uid: "text", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
];

export const statusOptions = [
    {name: "Active", uid: "active", value: "false" },
    {name: "Completed", uid: "completed", value: "true" },
];
