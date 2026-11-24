
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";
import { supabase } from "./supabase";

function App() {
  const [bookingCount, setBookingCount] = useState(0);
  const [matches, setMatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMatches();
    fetchBookingCount();
    fetchBookings();

    const channel = supabase
      .channel("ipl-database-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches"
        },
        () => {
          fetchMatches();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings"
        },
        () => {
          fetchBookingCount();
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setMatches(data || []);
      setError("");
    }

    setLoading(false);
  }

  async function fetchBookingCount() {
    const { count, error } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });

    if (!error) {
      setBookingCount(count || 0);
    }
  }

  async function fetchBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false });

    if (!error) {
      setBookings(data || []);
    }
  }

  async function handleBooking(match) {
    setMessage("");

    const customerName = window.prompt("Enter your name:");

    if (!customerName || !customerName.trim()) return;

    const ticketInput = window.prompt("Enter number of tickets:");

    if (ticketInput === null) return;

    const tickets = Number(ticketInput);

    if (!Number.isInteger(tickets) || tickets <= 0) {
      setMessage("Please enter a valid ticket quantity.");
      return;
    }

    if (tickets > match.available_seats) {
      setMessage("Not enough seats available!");
      return;
    }

    const remainingSeats = match.available_seats - tickets;
    const totalPrice = Number(match.price) * tickets;

    const { data: updatedMatch, error: updateError } = await supabase
      .from("matches")
      .update({ available_seats: remainingSeats })
      .eq("id", match.id)
      .gte("available_seats", tickets)
      .select();

    if (updateError || !updatedMatch || updatedMatch.length === 0) {
      setMessage(updateError?.message || "Seats are no longer available.");
      fetchMatches();
      return;
    }

    const { error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          match_id: match.id,
          customer_name: customerName.trim(),
          tickets: tickets,
          total_price: totalPrice
        }
      ]);

    if (bookingError) {
      await supabase
        .from("matches")
        .update({ available_seats: match.available_seats })
        .eq("id", match.id);

      setMessage("Booking failed: " + bookingError.message);
      fetchMatches();
      return;
    }

    setMessage(
      `Booking successful! ${tickets} ticket(s) booked for ${match.team1} vs ${match.team2}.`
    );

    fetchMatches();
    fetchBookingCount();
    fetchBookings();
  }

  return (
    <>
      <Navbar />
      <Hero />

      <section id="matches">
        <h2>Match Schedule</h2>

        <h3>Bookings: {bookingCount}</h3>

        {loading && <p>Loading matches...</p>}
        {error && <p>Error loading matches: {error}</p>}
        {message && <p>{message}</p>}

        <div className="match-container">
          {matches.map((item) => (
            <MatchCard
              key={item.id}
              match={`${item.team1} vs ${item.team2}`}
              date={item.date}
              venue={item.venue}
              price={item.price}
              availableSeats={item.available_seats}
              onBook={() => handleBooking(item)}
            />
          ))}
        </div>
      </section>

      <section id="my-bookings">
        <h2>My Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Match</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Booking Date</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => {
                const match = matches.find(
                  (item) => item.id === booking.match_id
                );

                return (
                  <tr key={booking.id}>
                    <td>{booking.customer_name}</td>
                    <td>
                      {match
                        ? `${match.team1} vs ${match.team2}`
                        : "Match"}
                    </td>
                    <td>{booking.tickets}</td>
                    <td>₹{booking.total_price}</td>
                    <td>
                      {new Date(booking.booking_date).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

export default App;
