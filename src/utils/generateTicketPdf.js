import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

const generateTicketPdf = async (booking, passengers, fare_details) => {
  if (!booking || passengers.length === 0) {
    alert("Missing ticket data.");
    return;
  }

  //-----------------------------
  // Create final PDF instance
  //-----------------------------
  const doc = new jsPDF("p", "mm", "a4");

  //-----------------------------
  // CUSTOM SAMPLE LOGO (SAFE)
  //-----------------------------
  const customLogo =
    "data:image/svg+xml;base64," +
    btoa(`
      <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
        <circle cx="75" cy="75" r="70" stroke="#1E3A8A" stroke-width="8" fill="white"/>
        <path d="M50 100 L75 40 L100 100 Z" stroke="#1E3A8A" stroke-width="6" fill="white"/>
        <circle cx="63" cy="108" r="7" fill="#1E3A8A"/>
        <circle cx="87" cy="108" r="7" fill="#1E3A8A"/>
      </svg>
    `);

  //doc.addImage(customLogo, "PNG", 15, 10, 28, 28);

  //-----------------------------
  // WATERMARK
  //-----------------------------
  doc.setFontSize(60);
  doc.setTextColor(220, 220, 220);
  doc.text("MOCK TRAIN TICKET", 20, 150, { angle: 35, opacity: 0.1 });

  //-----------------------------
  // TITLE
  //-----------------------------
  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text("Checkudla mock train reservation system", 50, 24);

  //-----------------------------
  // QR CODE (FULL JSON - Option B)
  //-----------------------------
  const customLogoPng =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABc0lEQVR4nO3VwY3CMBAG4GMUESOwgTIgwQbIgQQ7gZI4gSThA3zUuYjDdyCjTiMQuuLHcE7vFBbnDg7PzZlZMmSJEmSJEmSJEmSJEmSP48BfM2EnbXqUGkFjRzQ2i/QYILNPKTd/qv1BA33vL++T+fV///7Pd38DPMXb1BVI2g4h7AMwF8A3AXQBeAOwAUBeADQBeAOwMUAdAWgDsDFADQB2BdAPQBeA9AA0AdgXQ9QFYA9AbQFcDdAVAD0B9APgZ0A0AXAHUB8A3QDQBdAdQH0BdA3QJQA9AbQFUDdAVAD0BtAVQFsAdATQBcBdATQFsAdATQFcBcATQFsAdATQFcBcATQFsMXh0M3B28S5NlZMmSJEmSJEmSJEmSJEk+owD8CMA/AjAPwIwD8CMA/AjAPwIwH0P8zPnS4Vw9ZjAAAAAElFTkSuQmCC";
  const qrContent = JSON.stringify({ booking, passengers, fare_details });
  const qrDataURL = await QRCode.toDataURL(qrContent);

  //doc.addImage(customLogoPng, "PNG", 150, 10, 45, 45);

  //-----------------------------
  // BARCODE (PNR)
  //-----------------------------
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, booking.pnr, {
    format: "CODE128",
    displayValue: false,
    width: 1.5,
    height: 40,
  });
  const barcodeDataURL = canvas.toDataURL("image/png");

  doc.addImage(barcodeDataURL, "PNG", 15, 45, 70, 20);

  //-----------------------------
  // BOOKING DETAILS SECTION
  //-----------------------------
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  let y = 75;
  const addLine = (label, value) => {
    doc.setFont(undefined, "bold");
    doc.text(`${label}:`, 14, y);
    doc.setFont(undefined, "normal");
    doc.text(String(value || "-"), 55, y);
    y += 7;
  };

  addLine("PNR", booking.pnr);
  addLine("Status", booking.pnr_status);
  addLine("Train Number", booking.train_number);
  addLine("Journey Date", booking.date_of_journey);
  addLine("Route", `${booking.source_name} → ${booking.destination_name}`);
  addLine("Boarding", booking.boarding_point_name);
  addLine("Departure", booking.scheduled_departure);
  addLine("Arrival", booking.estimated_arrival);

  //-----------------------------
  // PERFORATION DIVIDER
  //-----------------------------
  doc.setDrawColor(180);
  doc.setLineDash([2, 2]);
  doc.line(10, y + 2, 200, y + 2);
  doc.setLineDash([]);

  //-----------------------------
  // PASSENGERS TABLE
  //-----------------------------
  const passengerRows = passengers.map((p) => [
    p.p_name,
    p.p_age,
    p.p_gender,
    p.updated_seat_status,
    p.is_child ? "Child" : p.is_senior ? "Senior" : "Adult",
  ]);

  autoTable(doc, {
    head: [["Name", "Age", "Gender", "Seat", "Category"]],
    body: passengerRows,
    startY: y + 10,
    theme: "grid",
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontSize: 11,
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });

  //-----------------------------
  // FARE SUMMARY
  //-----------------------------
  const fy = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  doc.text("Fare Summary", 14, fy);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const priceBase = fy + 10;
  doc.text(`Base Fare: ₹${fare_details.base_fare}`, 14, priceBase);

  const gstAmt = ((fare_details.base_fare * fare_details.GST) / 100).toFixed(2);
  doc.text(`GST (${fare_details.GST}%): ₹${gstAmt}`, 14, priceBase + 7);

  const convAmt = (
    (fare_details.base_fare * fare_details.convience) /
    100
  ).toFixed(2);
  doc.text(
    `Convenience Fee (${fare_details.convience}%): ₹${convAmt}`,
    14,
    priceBase + 14
  );

  doc.setFontSize(15);
  doc.setTextColor(0, 150, 0);
  doc.text(
    `Grand Total: ₹${fare_details.gross_fare.toFixed(2)}`,
    14,
    priceBase + 27
  );

  //-----------------------------
  // SIGNATURE BLOCK
  //-----------------------------
  doc.setDrawColor(150);
  doc.setLineWidth(0.4);
  doc.line(140, priceBase + 35, 200, priceBase + 35);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Railway Digital Signature", 142, priceBase + 41);

  //-----------------------------
  // LEGAL NOTE
  //-----------------------------
  doc.setFontSize(9);
  doc.text(
    "Valid only with original ID proof • Subject to IR rules • This is a computer generated ticket.",
    14,
    priceBase + 50
  );

  //-----------------------------
  // SAVE FILE
  //-----------------------------
  doc.save(`Ticket_${booking.pnr}.pdf`);
};

export default generateTicketPdf;
