import { type NextRequest, NextResponse } from "next/server"
import { deleteBooking } from "@/lib/mongodb-helpers"
import mongoose from "mongoose"

// DELETE /api/bookings/deletePassenger/[id] - Delete booking by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid booking ID format" }, { status: 400 })
    }

    // Delete booking
    const deletedBooking = await deleteBooking(id)

    if (!deletedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Booking deleted successfully",
        deletedBooking,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
