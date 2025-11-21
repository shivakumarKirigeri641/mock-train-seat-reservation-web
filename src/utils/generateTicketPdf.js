import jsPDF from "jspdf";
import "jspdf-autotable";

const generateTicketPdf = (trainDetails) => {
  let pnrNumber = "abc";
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Mock Train Ticket", 14, 15);

  // PNR
  doc.setFontSize(12);
  doc.text(`PNR: ${pnrNumber}`, 14, 25);

  // Train Info Table
  doc.autoTable({
    startY: 35,
    head: [
      ["Train Number", "Train Name", "From", "To", "Departure", "Arrival"],
    ],
    body: [
      [
        trainDetails.train_number,
        trainDetails.train_name,
        trainDetails.from,
        trainDetails.to,
        trainDetails.departure,
        trainDetails.arrival,
      ],
    ],
  });

  // Passenger Table
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Name", "Gender", "Age", "Type"]],
    body: passengers.map((p) => [
      p.name,
      p.gender,
      p.age,
      p.type, // adult / child / senior / pwd
    ]),
  });

  // Footer
  doc.text(
    "This is a mock ticket generated for UI testing only.",
    14,
    doc.lastAutoTable.finalY + 15
  );

  doc.save("ticket.pdf");
};
export default generateTicketPdf;
