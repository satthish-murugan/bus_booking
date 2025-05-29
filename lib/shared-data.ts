// Shared data store for demo purposes
// In production, this would be replaced with a real database

export interface Booking {
  id: string
  passengername: string
  busnumber: string
  seatnumber: string
  createdAt: string
}

// Initialize with some sample data
export const bookings: Booking[] = [
  {
    id: "1",
    passengername: "John Doe",
    busnumber: "BUS001",
    seatnumber: "A1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    passengername: "Jane Smith",
    busnumber: "BUS002",
    seatnumber: "B5",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    passengername: "Mike Johnson",
    busnumber: "BUS001",
    seatnumber: "C3",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    passengername: "Sarah Wilson",
    busnumber: "BUS003",
    seatnumber: "A2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    passengername: "David Brown",
    busnumber: "BUS002",
    seatnumber: "D1",
    createdAt: new Date().toISOString(),
  },
]

// Helper functions for data manipulation
export const getBookings = () => bookings

export const getBookingById = (id: string) => bookings.find((booking) => booking.id === id)

export const getBookingByName = (name: string) =>
  bookings.find((booking) => booking.passengername.toLowerCase() === name.toLowerCase())

export const addBooking = (booking: Omit<Booking, "id" | "createdAt">) => {
  const newId = (Math.max(...bookings.map((b) => Number.parseInt(b.id)), 0) + 1).toString()
  const newBooking: Booking = {
    ...booking,
    id: newId,
    createdAt: new Date().toISOString(),
  }
  bookings.push(newBooking)
  return newBooking
}

export const updateBooking = (id: string, updates: Partial<Booking>) => {
  const index = bookings.findIndex((booking) => booking.id === id)
  if (index === -1) return null

  bookings[index] = { ...bookings[index], ...updates }
  return bookings[index]
}

export const deleteBooking = (id: string) => {
  const index = bookings.findIndex((booking) => booking.id === id)
  if (index === -1) return null

  const deletedBooking = bookings[index]
  bookings.splice(index, 1)
  return deletedBooking
}

export const isSeatTaken = (busnumber: string, seatnumber: string, excludeId?: string) => {
  return bookings.some(
    (booking) => booking.busnumber === busnumber && booking.seatnumber === seatnumber && booking.id !== excludeId,
  )
}
