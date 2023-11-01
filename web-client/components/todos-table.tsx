"use client";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, SortDescriptor } from "@nextui-org/table";
import { Selection } from "@nextui-org/react";
import { Todo, columns } from "../app/todos/columns"
import { useState, useMemo, useCallback } from "react";
import { Pagination } from "@nextui-org/pagination";
import { SearchIcon } from "./icons";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function TodosTable({ todos }: { todos: Todo[] }) {
  const [filterValue, setFilterValue] = useState('')
  const hasSearchFilter = Boolean(filterValue)

  const filteredItems = useMemo(() => {
    let filteredItems = [...todos]

    if (hasSearchFilter) {
      filteredItems = filteredItems.filter(user =>
        user.text.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    return filteredItems
  }, [todos, filterValue, hasSearchFilter])

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-end justify-between gap-3'>
          <Input
            isClearable
            className='w-full sm:max-w-[40%]'
            placeholder='Search by text...'
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    )
  }, [filterValue, onSearchChange, onClear])



  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const rowsPerPage = 4
  const [page, setPage] = useState(1)
  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems])



  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending'
  })

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Todo, b: Todo) => {
      const first = a[sortDescriptor.column as keyof Todo] as string
      const second = b[sortDescriptor.column as keyof Todo] as string
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])


  return (
    <Table
      isStriped
      aria-label="Example table with dynamic content"
      color="primary"
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      onSelectionChange={setSelectedKeys}
      topContent={topContent}
      topContentPlacement="outside"
      bottomContent={
        <div className='flex w-full justify-center'>
          {/* <span className="w-[33%] text-small text-default-400 flex justify-center">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} selected`}
          </span> */}
          <Pagination
            isCompact
            showControls
            showShadow
            color='secondary'
            page={page}
            total={pages}
            onChange={page => setPage(page)}
            className="w-[33%] flex justify-center"
          />
        </div>
      }
      bottomContentPlacement="outside"
      className="w-[600px] text-left">
      <TableHeader columns={columns}>
        {(column) => <TableColumn allowsSorting key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={sortedItems} emptyContent={"No todos to display."}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
