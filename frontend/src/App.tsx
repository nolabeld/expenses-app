import "./App.css"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "./lib/api"
import { useQuery } from "@tanstack/react-query"

async function getTotalSpent() {
  const result = await api.expenses["getTotalSpent"].$get()
  if (!result.ok) {
    throw new Error("error")
  }
  const data = await result.json()
  return data
}

function App() {
  // Queries
  const { isPending, error, data } = useQuery({
    queryKey: ["getTotalSpent"],
    queryFn: getTotalSpent,
  })

  if (error) {
    return "Error:" + error.message
  }

  return (
    <div className="w-[400px] m-auto">
      <Card className="text-left">
        <CardHeader>
          <CardTitle>Total spent</CardTitle>
          <CardDescription>Total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>{isPending ? "Loading..." : data.total}</CardContent>
      </Card>
    </div>
  )
}

export default App
