import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
  component: About,
})

function About() {
  return <div className="m-auto max-w-xl py-2">Hello "/about"!</div>
}
