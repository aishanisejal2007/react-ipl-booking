
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";

function App() {
  const [bookingCount, setBookingCount] = useState(0);

  const matches = [
    {
      id: 1,
      match: "CSK vs MI",
      date: "10 April 2026, 7:30 PM",
      venue: "Chennai",
      price: 800
    },
    {
      id: 2,
      match: "RCB vs KKR",
      date: "12 April 2026, 7:30 PM",
      venue: "Bengaluru",
      price: 1000
    },
    {
      id: 3,
      match: "MI vs RCB",
      date: "15 April 2026, 7:30 PM",
      venue: "Mumbai",
      price: 900
    }
  ];

  function handleBooking() {
    setBookingCount((count) => count + 1);
  }

  return (
    <>
      <Navbar />
      <Hero />

      <section id="matches">
        <h2>Match Schedule</h2>

        <h3>Bookings: {bookingCount}</h3>

        <div className="match-container">
          {matches.map((item) => (
            <MatchCard
              key={item.id}
              match={item.match}
              date={item.date}
              venue={item.venue}
              price={item.price}
              onBook={handleBooking}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default App;
