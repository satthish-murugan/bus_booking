"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Eye, Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Booking {
  id: string
  passengername: string
  busnumber: string
  seatnumber: string
}

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get("/api/bookings")

      // Ensure we have an array of bookings
      const bookingsData = response.data
      if (Array.isArray(bookingsData)) {
        setBookings(bookingsData)
      } else {
        console.error("API response is not an array:", bookingsData)
        setBookings([])
        setError("Invalid data format received from server")
      }
    } catch (err) {
      setError("Failed to fetch bookings. Please try again.")
      setBookings([])
      console.error("Error fetching bookings:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            All Bookings
          </h1>
          <p className="text-muted-foreground mt-2">Manage and view all passenger bookings</p>
        </div>
        <Button onClick={fetchBookings} variant="outline">
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {Array.isArray(bookings) && bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{booking.passengername}</span>
                  <Badge variant="secondary">#{booking.id}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bus Number:</span>
                    <span className="font-medium">{booking.busnumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Seat Number:</span>
                    <span className="font-medium">{booking.seatnumber}</span>
                  </div>
                </div>
                <Button asChild className="w-full" size="sm">
                  <Link href={`/bookings/${booking.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-4">There are no passenger bookings in the system yet.</p>
              <Button asChild>
                <Link href="/create">Create First Booking</Link>
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}
