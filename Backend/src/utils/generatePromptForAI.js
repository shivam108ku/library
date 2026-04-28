

function buildSeatAllocationPrompt(bookings, requestedShift, startDate, endDate) {

  const formattedBookings = bookings.map(b => {
    const dateRange = `${b.startDate.toISOString().split("T")[0]} to ${b.endDate.toISOString().split("T")[0]}`;
    return `- Seat ${b.seatNo} → ${b.shift} (${dateRange})`;
  }).join("\n");

  const prompt = `
You are helping allocate seats in a library.

Total seats: 1 to 50
Requested shift: ${requestedShift}
Requested date range: ${startDate} to ${endDate}

Already allocated seats:
${formattedBookings}

Rules:
- A seat cannot be allotted if it overlaps date range AND has the same shift or fullday.
- If shift is fullday, avoid seats used in any shift for overlapping dates.
- If you have to allot a seat for first or second shift then first try to allot a seat available with the opposite slot, rather than the empty one. 
- Choose the lowest available seat number.
- Return JSON only, no explanation text.

Return format:
{
  "seatNo": <best seat number>,
  "reason": "<short reason>"
}
  `.trim();

  return prompt;
}

module.exports = { buildSeatAllocationPrompt };
