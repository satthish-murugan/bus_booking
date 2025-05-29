import { type NextRequest, NextResponse } from "next/server"
import { getBookingById, updateBooking, isSeatTaken } from "@/lib/mongodb-helpers"
import mongoose from "mongoose"

// PUT /api/bookings/updatePassenger/[id] - Update booking by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { passengername, busnumber, seatnumber } = body

    // Validation
    if (!passengername || !busnumber || !seatnumber) {
      return NextResponse.json(
        { error: "All fields are required: passengername, busnumber, seatnumber" },
        { status: 400 },
      )
    }

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid booking ID format" }, { status: 400 })
    }

    // Check if booking exists
    const existingBooking = await getBookingById(id)
    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if the new seat is already taken on the same bus (excluding current booking)
    if (await isSeatTaken(busnumber, seatnumber, id)) {
      return NextResponse.json({ error: `Seat ${seatnumber} is already taken on bus ${busnumber}` }, { status: 409 })
    }

    // Update booking
    const updatedBooking = await updateBooking(id, {
      passengername: passengername.trim(),
      busnumber: busnumber.trim(),
      seatnumber: seatnumber.trim(),
    })

    return NextResponse.json(updatedBooking, { status: 200 })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
