
function MatchCard({ match, date, venue, price, onBook }) {
  return (
    <div className="match-card">
      <h3>{match}</h3>
      <p>Date: {date}</p>
      <p>Venue: {venue}</p>
      <p>Ticket Price: ₹{price}</p>
      <button onClick={onBook}>Book Ticket</button>
    </div>
  );
}

export default MatchCard;
