import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
  component: About,
})

function About() {
  return <h2 className="m-auto max-w-xl p-2 text-lg">Soon.</h2>
}
