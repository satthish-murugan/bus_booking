"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, User, Bus, MapPin, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Booking {
  id: string
  passengername: string
  busnumber: string
  seatnumber: string
}

export default function SearchPage() {
  const [passengerName, setPassengerName] = useState("")
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passengerName.trim()) return

    try {
      setLoading(true)
      setError(null)
      setSearched(true)
      const response = await axios.get(`/api/bookings/name/${encodeURIComponent(passengerName.trim())}`)
      setBooking(response.data)
    } catch (err) {
      setError("No booking found for this passenger name.")
      setBooking(null)
      console.error("Error searching booking:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Search className="h-8 w-8" />
          Search Booking
        </h1>
        <p className="text-muted-foreground">Find a booking by entering the passenger name</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search by Passenger Name</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="passengerName">Passenger Name</Label>
              <Input
                id="passengerName"
                type="text"
                placeholder="Enter passenger name"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Booking
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && searched && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {booking && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Booking Found</CardTitle>
              <Badge variant="secondary">#{booking.id}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Passenger Name</p>
                  <p className="font-semibold">{booking.passengername}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Bus className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Bus Number</p>
                  <p className="font-semibold">{booking.busnumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Seat Number</p>
                  <p className="font-semibold">{booking.seatnumber}</p>
                </div>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href={`/bookings/${booking.id}`}>View Full Details</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {searched && !booking && !error && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No booking found</h3>
            <p className="text-muted-foreground">
              No booking was found for "{passengerName}". Please check the name and try again.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
