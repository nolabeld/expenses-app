import { Button } from "@/components/ui/button"
import { deleteExpense, getAllExpensesQueryOptions } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash, Loader } from "lucide-react"
import { toast } from "sonner"

export const ExpenseDeleteButton = ({ id }: { id: number }) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast("Error", {
        description: "Something went wrong.",
      })
    },
    onSuccess: () => {
      queryClient.setQueryData(
        getAllExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter(
            (expense) => expense.id !== id,
          ),
        }),
      )

      // Boom baby!
      toast("Success", {
        description: "Expense deleted.",
      })
    },
  })
  return (
    <Button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
      size={"icon"}
      variant={"destructive"}
    >
      {mutation.isPending ? (
        <Loader className="animate-spin" />
      ) : (
        <Trash className="w-2 h-6" />
      )}
    </Button>
  )
}
