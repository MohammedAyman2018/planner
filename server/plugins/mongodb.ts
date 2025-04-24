import { connectToDatabase } from '../db'

export default async () => {
    await connectToDatabase()
}