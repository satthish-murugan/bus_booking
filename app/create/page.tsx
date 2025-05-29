"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateBookingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    passengername: "",
    busnumber: "",
    seatnumber: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      await axios.post("/api/bookings", formData)

      setSuccess(true)
      setFormData({
        passengername: "",
        busnumber: "",
        seatnumber: "",
      })

      // Redirect to bookings page after a short delay
      setTimeout(() => {
        router.push("/bookings")
      }, 2000)
    } catch (err) {
      setError("Failed to create booking. Please try again.")
      console.error("Error creating booking:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Plus className="h-8 w-8" />
          Create New Booking
        </h1>
        <p className="text-muted-foreground">Fill in the details below to create a new passenger booking</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Booking created successfully! Redirecting to all bookings...</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Booking Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Booking
                  </>
                )}
              </Button>

              <Button type="button" variant="outline" onClick={() => router.push("/bookings")} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
