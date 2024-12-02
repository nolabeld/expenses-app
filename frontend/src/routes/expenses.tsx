import { createFileRoute } from "@tanstack/react-router"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/expenses")({
  component: Expenses,
})

async function getAllExpenses() {
  const result = await api.expenses.$get()
  if (!result.ok) {
    throw new Error("error")
  }
  const data = await result.json()
  return data
}

function Expenses() {
  // Queries
  const { isPending, error, data } = useQuery({
    queryKey: ["getAllExpenses"],
    queryFn: getAllExpenses,
  })

  if (error) {
    return "Error:" + error.message
  }

  return (
    <div className="p-2 max-w-3xl m-auto">
      <Table>
        <TableCaption>All expenses: </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <AllExpensesSkeleton />
          ) : (
            data?.expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell className="text-right">${expense.amount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function AllExpensesSkeleton() {
  return Array(3)
    .fill(0)
    .map((_, i) => (
      <TableRow key={i}>
        <TableCell className="font-medium">
          <Skeleton className="w-[20px] h-[20px] rounded-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="w-[200px] h-[20px] rounded-full" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="w-[50px] h-[20px] ml-auto rounded-full" />
        </TableCell>
      </TableRow>
    ))
}
