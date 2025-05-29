import { type NextRequest, NextResponse } from "next/server"
import { getBookingById } from "@/lib/mongodb-helpers"

// GET /api/bookings/[id] - Get booking by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Find booking by ID
    const booking = await getBookingById(id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking, { status: 200 })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}
