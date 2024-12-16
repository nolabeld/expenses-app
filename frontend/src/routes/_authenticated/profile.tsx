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
    <div className="py-2 m-auto max-w-xl flex gap-2 items-center">
      <Button>
        <a href="/api/logout">Logout</a>
      </Button>
      Hello, {data.user.given_name}! Nice to see you!
    </div>
  )
}
