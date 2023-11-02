import React, {Key} from "react";
import {Todo} from "@/components/todos-table/data";
export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getTodoStatus(completed: boolean) {
    return completed ? "completed" : "active";
}

export function getTodoCellValue(todo: Todo, columnKey?: Key) {
    return columnKey == "status"
        ? getTodoStatus(todo.completed)
        : todo[columnKey as keyof Todo];
}