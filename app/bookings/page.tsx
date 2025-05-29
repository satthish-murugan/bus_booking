"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const BookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get("/api/bookings")

      // Check if response is HTML (error page) instead of JSON
      if (typeof response.data === "string" && response.data.includes("<!DOCTYPE html>")) {
        throw new Error("API returned HTML instead of JSON - check server configuration")
      }

      // Ensure we have an array of bookings
      const bookingsData = response.data
      if (Array.isArray(bookingsData)) {
        setBookings(bookingsData)
      } else {
        console.error("API response is not an array:", bookingsData)
        setBookings([])
        setError("Invalid data format received from server")
      }
    } catch (err: any) {
      if (err.message?.includes("HTML instead of JSON")) {
        setError("Server configuration error. Please check API routes and database connection.")
      } else {
        setError("Failed to fetch bookings. Please try again.")
      }
      setBookings([])
      console.error("Error fetching bookings:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading bookings...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Bookings</h1>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              {/* Display booking details here */}
              Booking ID: {booking.id}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  )
}

export default BookingsPage
