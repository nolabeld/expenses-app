import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm } from "@tanstack/react-form"
import { api } from "@/lib/api"

export const Route = createFileRoute("/create-expense")({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const res = await api.expenses.$post({ json: value })
      if (!res.ok) {
        throw new Error("server error")
      }
      navigate({ to: "/expenses" })
    },
  })

  return (
    <div className="grid max-w-xl items-center gap-1.5 m-auto py-4">
      <h2>Create new expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex flex-col gap-2"
      >
        <form.Field
          name="title"
          children={(field) => (
            <>
              <Label htmlFor="title">Title</Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Name of the expense"
                type="text"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </>
          )}
        />
        <form.Field
          name="amount"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(+e.target.value)}
                placeholder="Name of the expense"
                type="number"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
