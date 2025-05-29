"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, Edit, Trash2, User, Bus, MapPin, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Booking {
  id: string
  passengername: string
  busnumber: string
  seatnumber: string
}

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchBooking(params.id as string)
    }
  }, [params.id])

  const fetchBooking = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`/api/bookings/${id}`)
      setBooking(response.data)
    } catch (err) {
      setError("Failed to fetch booking details. Please try again.")
      console.error("Error fetching booking:", err)
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
            <p className="text-muted-foreground">Loading booking details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Booking not found"}</AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button asChild variant="outline">
            <Link href="/bookings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Bookings
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/bookings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Bookings
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Booking Details</CardTitle>
            <Badge variant="secondary">#{booking.id}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Passenger Name</p>
                <p className="font-semibold text-lg">{booking.passengername}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Bus className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Bus Number</p>
                <p className="font-semibold text-lg">{booking.busnumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Seat Number</p>
                <p className="font-semibold text-lg">{booking.seatnumber}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <Link href={`/update?id=${booking.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Update Booking
              </Link>
            </Button>
            <Button asChild variant="destructive" className="flex-1">
              <Link href={`/delete?id=${booking.id}`}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Booking
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
