"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2, CheckCircle, AlertCircle, Search, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Booking {
  id: string
  passengername: string
  busnumber: string
  seatnumber: string
}

export default function DeleteBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")

  const [searchId, setSearchId] = useState(bookingId || "")
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (bookingId) {
      fetchBooking(bookingId)
    }
  }, [bookingId])

  const fetchBooking = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`/api/bookings/${id}`)
      setBooking(response.data)
    } catch (err) {
      setError("Booking not found. Please check the ID and try again.")
      setBooking(null)
      console.error("Error fetching booking:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchId.trim()) return
    await fetchBooking(searchId.trim())
  }

  const handleDelete = async () => {
    if (!booking) return

    try {
      setDeleting(true)
      setError(null)
      setSuccess(false)

      await axios.delete(`/api/bookings/deletePassenger/${booking.id}`)

      setSuccess(true)
      setBooking(null)

      // Redirect to bookings page after a short delay
      setTimeout(() => {
        router.push("/bookings")
      }, 2000)
    } catch (err) {
      setError("Failed to delete booking. Please try again.")
      console.error("Error deleting booking:", err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Trash2 className="h-8 w-8" />
          Delete Booking
        </h1>
        <p className="text-muted-foreground">Search for a booking by ID and permanently delete it from the system</p>
      </div>

      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Find Booking to Delete</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="searchId">Booking ID</Label>
              <Input
                id="searchId"
                type="text"
                placeholder="Enter booking ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find Booking
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Booking deleted successfully! Redirecting to all bookings...</AlertDescription>
        </Alert>
      )}

      {/* Delete Confirmation */}
      {booking && !success && (
        <>
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This action cannot be undone. The booking will be permanently deleted from the
              system.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-destructive">Delete Booking</CardTitle>
                <Badge variant="secondary">#{booking.id}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Passenger Name</p>
                  <p className="font-semibold">{booking.passengername}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Bus Number</p>
                  <p className="font-semibold">{booking.busnumber}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Seat Number</p>
                  <p className="font-semibold">{booking.seatnumber}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleting}>
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Confirm Delete
                    </>
                  )}
                </Button>

                <Button type="button" variant="outline" onClick={() => router.push("/bookings")} disabled={deleting}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
