import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, Users, Search, Plus, Edit, Trash2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Bus className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Bus Passenger Booking System</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your bus bookings efficiently with our comprehensive booking management system. Book, update, search,
          and manage passenger reservations with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Bookings
            </CardTitle>
            <CardDescription>View and manage all passenger bookings in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/bookings">View All Bookings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Booking
            </CardTitle>
            <CardDescription>Find a specific booking by passenger name</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/search">Search by Name</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Booking
            </CardTitle>
            <CardDescription>Create a new passenger booking reservation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/create">Create Booking</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Update Booking
            </CardTitle>
            <CardDescription>Modify existing booking information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/update">Update Booking</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Booking
            </CardTitle>
            <CardDescription>Remove a booking from the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="destructive" className="w-full">
              <Link href="/delete">Delete Booking</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
