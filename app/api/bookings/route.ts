import { type NextRequest, NextResponse } from "next/server"
import { getBookings, addBooking, isSeatTaken } from "@/lib/mongodb-helpers"

// GET /api/bookings - Get all bookings
export async function GET() {
  try {
    console.log("Fetching all bookings from MongoDB...")
    const bookings = await getBookings()
    console.log("Found bookings:", bookings.length)

    return NextResponse.json(bookings, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { passengername, busnumber, seatnumber } = body

    // Validation
    if (!passengername || !busnumber || !seatnumber) {
      return NextResponse.json(
        { error: "All fields are required: passengername, busnumber, seatnumber" },
        { status: 400 },
      )
    }

    // Check if seat is already taken on the same bus
    if (await isSeatTaken(busnumber, seatnumber)) {
      return NextResponse.json({ error: `Seat ${seatnumber} is already taken on bus ${busnumber}` }, { status: 409 })
    }

    // Create new booking
    const newBooking = await addBooking({
      passengername: passengername.trim(),
      busnumber: busnumber.trim(),
      seatnumber: seatnumber.trim(),
    })

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
