import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useForm } from "@tanstack/react-form"
import { api } from "@/lib/api"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { createExpenseSchema } from "@server/sharedTypes"

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate()
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      amount: "",
      date: new Date().toISOString(),
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
          validatorAdapter={zodValidator()}
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
          children={(field) => (
            <div>
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
            </div>
          )}
        />
        <form.Field
          name="amount"
          validatorAdapter={zodValidator()}
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Name of the expense"
                type="number"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </div>
          )}
        />
        <form.Field
          name="date"
          validatorAdapter={zodValidator()}
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
          children={(field) => (
            <div className="self-center">
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) =>
                  field.handleChange((date ?? new Date()).toISOString())
                }
                className="rounded-md border shadow"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </div>
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
