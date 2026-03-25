import { loadenv } from "./env"
import { selectAndHello } from "./provider"


async function main(){
  loadenv()
  try {
const result = await selectAndHello()
process.stdout.write(JSON.stringify(result , null ,2) + "\n")
  } catch (err) {
  const message = err instanceof Error? err.message :String(err)
  console.error(message)
  }
}

main()
