
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";

function App() {
  const [selectedMatch, setSelectedMatch] = useState("");

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

  return (
    <>
      <Navbar />
      <Hero />

      <section id="matches">
        <h2>Match Schedule</h2>

        <div className="match-container">
          {matches.map((item) => (
            <MatchCard
              key={item.id}
              match={item.match}
              date={item.date}
              venue={item.venue}
              price={item.price}
              onBook={() => setSelectedMatch(item.match)}
            />
          ))}
        </div>

        {selectedMatch && (
          <div className="booking-message">
            <h3>Selected Match: {selectedMatch}</h3>
            <p>You have selected this match for booking!</p>
            <button onClick={() => setSelectedMatch("")}>
              Clear Selection
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default App;
