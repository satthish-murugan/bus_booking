import { type NextRequest, NextResponse } from "next/server"
import { getBookingByName } from "@/lib/shared-data"

// GET /api/bookings/name/[passengername] - Search booking by passenger name
export async function GET(request: NextRequest, { params }: { params: { passengername: string } }) {
  try {
    const { passengername } = params
    const decodedName = decodeURIComponent(passengername)

    // Find booking by passenger name (case-insensitive)
    const booking = getBookingByName(decodedName)

    if (!booking) {
      return NextResponse.json({ error: "No booking found for this passenger name" }, { status: 404 })
    }

    return NextResponse.json(booking, { status: 200 })
  } catch (error) {
    console.error("Error searching booking:", error)
    return NextResponse.json({ error: "Failed to search booking" }, { status: 500 })
  }
}
