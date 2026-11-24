
function MatchCard({
  match,
  date,
  venue,
  price,
  availableSeats,
  onBook
}) {
  return (
    <div className="match-card">
      <h3>{match}</h3>

      <p>Date: {date}</p>

      <p>Venue: {venue}</p>

      <p>Ticket Price: ₹{price}</p>

      <p>Available Seats: {availableSeats}</p>

      <button
        onClick={onBook}
        disabled={availableSeats <= 0}
      >
        {availableSeats <= 0 ? "Sold Out" : "Book Ticket"}
      </button>
    </div>
  );
}

export default MatchCard;
