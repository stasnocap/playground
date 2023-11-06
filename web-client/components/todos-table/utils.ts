import React, {Key} from "react";
import {Todo} from "@/components/todos-table/columns";

export function getTodoStatus(completed: boolean) {
    return completed ? "completed" : "active";
}

export function getTodoCellValue(todo: Todo, columnKey?: Key) {
    return columnKey == "status"
        ? getTodoStatus(todo.completed)
        : todo[columnKey as keyof Todo];
}