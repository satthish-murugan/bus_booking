"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Edit, CheckCircle, AlertCircle, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Booking {
  id: string
  passengername: string
  busnumber: string
  seatnumber: string
}

export default function UpdateBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")

  const [searchId, setSearchId] = useState(bookingId || "")
  const [booking, setBooking] = useState<Booking | null>(null)
  const [formData, setFormData] = useState({
    passengername: "",
    busnumber: "",
    seatnumber: "",
  })
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
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
      const bookingData = response.data
      setBooking(bookingData)
      setFormData({
        passengername: bookingData.passengername,
        busnumber: bookingData.busnumber,
        seatnumber: bookingData.seatnumber,
      })
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking) return

    try {
      setUpdating(true)
      setError(null)
      setSuccess(false)

      await axios.put(`/api/bookings/updatePassenger/${booking.id}`, formData)

      setSuccess(true)

      // Redirect to booking details after a short delay
      setTimeout(() => {
        router.push(`/bookings/${booking.id}`)
      }, 2000)
    } catch (err) {
      setError("Failed to update booking. Please try again.")
      console.error("Error updating booking:", err)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Edit className="h-8 w-8" />
          Update Booking
        </h1>
        <p className="text-muted-foreground">Search for a booking by ID and update its details</p>
      </div>

      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Find Booking to Update</CardTitle>
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
          <AlertDescription>Booking updated successfully! Redirecting to booking details...</AlertDescription>
        </Alert>
      )}

      {/* Update Form */}
      {booking && (
        <Card>
          <CardHeader>
            <CardTitle>Update Booking #{booking.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="passengername">Passenger Name *</Label>
                <Input
                  id="passengername"
                  name="passengername"
                  type="text"
                  placeholder="Enter passenger full name"
                  value={formData.passengername}
                  onChange={handleInputChange}
                  required
                  disabled={updating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="busnumber">Bus Number *</Label>
                <Input
                  id="busnumber"
                  name="busnumber"
                  type="text"
                  placeholder="Enter bus number (e.g., BUS001)"
                  value={formData.busnumber}
                  onChange={handleInputChange}
                  required
                  disabled={updating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seatnumber">Seat Number *</Label>
                <Input
                  id="seatnumber"
                  name="seatnumber"
                  type="text"
                  placeholder="Enter seat number (e.g., A1, B12)"
                  value={formData.seatnumber}
                  onChange={handleInputChange}
                  required
                  disabled={updating}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Booking
                    </>
                  )}
                </Button>

                <Button type="button" variant="outline" onClick={() => router.push("/bookings")} disabled={updating}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
