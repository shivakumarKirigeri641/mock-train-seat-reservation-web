import generateTicketPdf from "../utils/generateTicketPdf";

const TicketConfirmationPage = ({ ticketData }) => {
  // Placeholder when no data is passed
  if (!ticketData) {
    ticketData = {
      pnr: "87X92K",
      train: {
        train_number: "12627",
        train_name: "Karnataka Express",
        departure: "10:30",
        arrival: "18:45",
        from: "SBC",
        to: "NDLS",
        duration: "32h 15m",
      },
      journey_date: "2025-01-12",
      coach: "3A",
      reservation_type: "General",
      passengers: [
        { name: "Rakesh", age: 32, gender: "M", type: "Adult" },
        { name: "Diya", age: 4, gender: "F", type: "Child" },
      ],
      mobile: "9876543210",
      total_fare: "₹1420",
    };
  }

  const downloadPDF = () => {
    alert("PDF export placeholder — integrate pdf-lib or jsPDF later.");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 border border-gray-200">
        {/* Header */}
        <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">
          Ticket Confirmed!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Your mock ticket has been successfully booked.
        </p>

        {/* PNR */}
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-8 text-center">
          <span className="text-lg font-semibold text-green-800">
            PNR Number: {ticketData.pnr}
          </span>
        </div>

        {/* Train Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Train Details
          </h2>

          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p>
              <strong>Train:</strong> {ticketData.train.train_number} —{" "}
              {ticketData.train.train_name}
            </p>
            <p>
              <strong>Date:</strong> {ticketData.journey_date}
            </p>
            <p>
              <strong>From:</strong> {ticketData.train.from}
            </p>
            <p>
              <strong>To:</strong> {ticketData.train.to}
            </p>
            <p>
              <strong>Departure:</strong> {ticketData.train.departure}
            </p>
            <p>
              <strong>Arrival:</strong> {ticketData.train.arrival}
            </p>
            <p>
              <strong>Duration:</strong> {ticketData.train.duration}
            </p>
            <p>
              <strong>Coach:</strong> {ticketData.coach}
            </p>
            <p>
              <strong>Reservation:</strong> {ticketData.reservation_type}
            </p>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Passenger Details
          </h2>

          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            {ticketData.passengers.map((p, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b py-2 last:border-none"
              >
                <div>
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-sm text-gray-600">
                    {p.type} • Age: {p.age} • {p.gender}
                  </p>
                </div>
                <span className="text-gray-500 text-sm">
                  Passenger {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Payment */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Contact & Payment
          </h2>

          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg grid grid-cols-2 gap-3">
            <p>
              <strong>Mobile:</strong> {ticketData.mobile}
            </p>
            <p>
              <strong>Total Fare:</strong> {ticketData.total_fare}
            </p>
          </div>
        </div>

        {/* PDF Download */}
        <div className="text-center">
          <button
            onClick={() => generateTicketPdf(ticketData)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition font-medium"
          >
            Export Ticket as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketConfirmationPage;
