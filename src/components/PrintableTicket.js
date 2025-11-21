import React, { forwardRef } from "react";

const PrintableTicket = forwardRef(({ ticketData }, ref) => {
  return (
    <div ref={ref} className="p-4 text-sm">
      <h2 className="text-xl font-bold mb-2">Ticket Confirmation</h2>
      <p>
        <strong>PNR:</strong> {ticketData.pnr}
      </p>
      <p>
        <strong>Train:</strong> {ticketData.train_name} (
        {ticketData.train_number})
      </p>
      <p>
        <strong>From:</strong> {ticketData.from}
      </p>
      <p>
        <strong>To:</strong> {ticketData.to}
      </p>
      <p>
        <strong>Departure:</strong> {ticketData.departure}
      </p>
      <p>
        <strong>Arrival:</strong> {ticketData.arrival}
      </p>

      <h3 className="text-lg font-semibold mt-4">Passengers</h3>
      <ul>
        {ticketData.passengers.map((p, index) => (
          <li key={index}>
            {p.name}, {p.age} ({p.gender})
          </li>
        ))}
      </ul>
    </div>
  );
});

export default PrintableTicket;
