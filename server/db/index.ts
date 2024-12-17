// Make sure to install the 'postgres' package
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

const queryClient = neon(process.env.DATABASE_URL!)
export const db = drizzle({ client: queryClient })
console.log(process.env.DATABASE_URL)
