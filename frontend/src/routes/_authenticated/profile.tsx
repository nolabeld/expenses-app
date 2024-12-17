import { createFileRoute } from "@tanstack/react-router"

import { userQueryOptions } from "../../lib/api"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
})

function Profile() {
  // Queries
  const { isPending, error, data } = useQuery(userQueryOptions)
  if (isPending) return "Loading..."
  if (error) return "Not logged in"

  return (
    <div className="py-6 px-2 m-auto max-w-xl flex flex-col gap-4 items-center">
      <h2 className="text-2xl">
        Hello, {data.user.given_name}! Nice to see you!
      </h2>
      <Button>
        <a href="/api/logout">Logout</a>
      </Button>
    </div>
  )
}
