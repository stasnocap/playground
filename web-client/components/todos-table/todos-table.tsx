"use client";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination,
    Selection,
    SortDescriptor, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from "@nextui-org/react";
import {PlusIcon, ChevronDownIcon, SearchIcon} from "../icons";
import {columns, statusOptions, Todo} from "./columns";
import {getTodoCellValue, getTodoStatus} from "./utils";
import {ChangeEvent, Key, useCallback, useMemo, useState} from "react";
import {capitalize, maxBy} from "@/components/utils";
import useSWR from "swr";

const INITIAL_VISIBLE_COLUMNS = ["id", "text", "status"];

const getTodos = () => fetch("/api/todos", { cache: "no-store"}).then(res => res.json());

export default function TodosTable() {
    const { data: todosData, error: todosError, isLoading: todosIsLoading, mutate: todosMutate } = useSWR('/api/todos', getTodos);

    const todos = todosData ? todosData as Todo[] : [];
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const {isOpen: isAddModalOpen, onOpen: addModalOnOpen, onOpenChange: addModalOnOpenChange} = useDisclosure();
    const {isOpen: isDeleteModalOpen, onOpen: deleteModalOnOpen, onOpenChange: deleteModalOnOpenChange} = useDisclosure();
    
    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        if (!todos.length) return todos;
        let filteredTodos = [...todos];

        if (hasSearchFilter) {
            filteredTodos = filteredTodos.filter((todo) =>
                todo.text.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredTodos = filteredTodos.filter((todo) => {
                return Array.from(statusFilter).includes(getTodoStatus(todo.completed));
            });
        }

        return filteredTodos;
    }, [todos, filterValue, statusFilter]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a: Todo, b: Todo) => {
            const first = getTodoCellValue(a, sortDescriptor.column) as number;
            const second = getTodoCellValue(b, sortDescriptor.column) as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = useCallback((todo: Todo, columnKey: Key) => {
        const cellValue = getTodoCellValue(todo, columnKey);

        switch (columnKey) {
            case "status":
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={todo.completed ? "success" : "warning"}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue}
                    </Chip>
                );
            default:
                return cellValue;
        }
    }, []);


    const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                        placeholder="Search by text..."
                        size="sm"
                        startContent={<SearchIcon className="text-default-300"/>}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small"/>}
                                    size="sm"
                                    variant="flat"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small"/>}
                                    size="sm"
                                    variant="flat"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button onPress={addModalOnOpen} size="sm" endContent={<PlusIcon></PlusIcon>}
                                color="primary">Add</Button>
                        <Button onPress={deleteModalOnOpen} size="sm" isDisabled={!(selectedKeys as Set<string>).size}
                                color="danger">Delete</Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {todos.length} todos</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        todos.length,
        hasSearchFilter,
        selectedKeys
    ]);

    const pages = Math.ceil(todos.length / rowsPerPage);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-center items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = useMemo(
        () => ({
            wrapper: ["max-h-[382px]", "max-w-3xl"],
            th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
            td: [
                // changing the rows border radius
                // first
                "group-data-[first=true]:first:before:rounded-none",
                "group-data-[first=true]:last:before:rounded-none",
                // middle
                "group-data-[middle=true]:before:rounded-none",
                // last
                "group-data-[last=true]:first:before:rounded-none",
                "group-data-[last=true]:last:before:rounded-none",
            ],
        }),
        [],
    );
    
    if (todosError) return <div>failed to load</div>
    if (todosIsLoading) return <div>loading...</div>

    return (
        <>
            <Table
                isCompact
                removeWrapper
                aria-label="Example table with custom cells, pagination and sorting"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                checkboxesProps={{
                    classNames: {
                        wrapper: "after:bg-foreground after:text-background text-background",
                    },
                }}
                classNames={classNames}
                selectedKeys={selectedKeys}
                selectionMode="single"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No todoss found"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal isOpen={isAddModalOpen} onOpenChange={addModalOnOpenChange}>
                <ModalContent>
                    {(onClose) => {
                        const [isLoading, setIsLoading] = useState<boolean>(false)
                        const [todo, setTodo] = useState<Todo>({text: "", completed: false} as Todo);

                        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
                            const {name, value} = e.target;

                            setTodo(prevState => ({
                                ...prevState,
                                [name]: value
                            }) as Todo);
                        };

                        const add = () => {
                            setIsLoading(true);

                            fetch('api/todos', {
                                method: "post",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(todo)
                            })
                                .then(response => {
                                    if (response.status == 200) {
                                        todo.id = maxBy(todos, (x: Todo) => x.id).id + 1;

                                        onClose();
                                        
                                        return todosMutate([...todos, todo]);
                                    }
                                })
                                .catch(x => {
                                    console.error("something went wrong");
                                })
                                .finally(() => {
                                    setIsLoading(false);
                                });
                        };
                        
                        return (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Add</ModalHeader>
                                <ModalBody>
                                    <Input
                                        autoFocus
                                        label="Text"
                                        placeholder="Enter your todo text"
                                        variant="bordered"
                                        name="text"
                                        value={todo.text}
                                        onChange={handleChange}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="primary" onPress={add} disabled={isLoading}>
                                        {isLoading ? "Loading" : "Confirm"}
                                    </Button>
                                </ModalFooter>
                            </>
                        )
                    }}
                </ModalContent>
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onOpenChange={deleteModalOnOpenChange}>
                <ModalContent>
                    {(onClose) => {
                        const [isLoading, setIsLoading] = useState<boolean>(false)

                        const remove = () => {
                            setIsLoading(true);
                            
                            const selectedKeysSet = selectedKeys as Set<string>;
                            if (selectedKeysSet.size != 1) return;

                            const id = selectedKeysSet.values().next().value;

                            fetch(`api/todos/${id}`, {
                                method: "delete",
                            })
                                .then(response => {
                                    if (response.status == 200) {
                                        selectedKeysSet.delete(id);

                                        onClose();
                                        
                                        const todosFiltered = todos.filter(x=>x.id !=id)
                                        return todosMutate(todosFiltered);
                                    }
                                })
                                .catch(x => {
                                    console.error("something went wrong");
                                })
                                .finally(() => {
                                    setIsLoading(false);
                                });
                        };

                        return (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Delete</ModalHeader>
                                <ModalBody>
                                    Are you sure?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="primary" onPress={remove} disabled={isLoading}>
                                        {isLoading ? "Loading" : "Confirm"}
                                    </Button>
                                </ModalFooter>
                            </>
                        )
                    }}
                </ModalContent>
            </Modal>
        </>
    );
}
