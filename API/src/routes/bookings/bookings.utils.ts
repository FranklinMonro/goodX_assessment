import { DateTime } from 'luxon';
import { sendEmail, EmailOptions } from '../../server/nodemailer';
import { bookingLogger as log } from '../../server/winston';
import { BookingDetails } from './bookings.interfaces';

const sendBookingEmail = async (
  bookingDetails: BookingDetails
): Promise<void | Error> => {
  try {
    const htmlContent = `
                      <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Booking Confirmation</title>
                    <style>
                      body {
                        font-family: sans-serif;
                        line-height: 1.6;
                        margin: 20px;
                      }
                      .booking-details {
                        border: 1px solid #ddd;
                        padding: 20px;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                      }
                      .detail-item {
                        margin-bottom: 10px;
                      }
                      .detail-label {
                        font-weight: bold;
                        margin-right: 5px;
                      }

                    </style>
                  </head>
                  <body>
                    <h1>Your Booking Confirmation</h1>

                    <div class="booking-details">
                      <div class="detail-item"><span class="detail-label">Name:</span> ${bookingDetails.name}</div>
                      <div class="detail-item"><span class="detail-label">Date:</span> ${bookingDetails.date}</div>
                      <div class="detail-item"><span class="detail-label">Time:</span> ${bookingDetails.time}</div>
                      <div class="detail-item"><span class="detail-label">Duration:</span> ${bookingDetails.duration} hours</div>
                      <div class="detail-item"><span class="detail-label">Type:</span> ${bookingDetails.type}</div>
                    </div>

                    <p>Thank you for your booking!</p>
                  </body>
                  </html>`;
    const emailOptions: EmailOptions = {
      from: 'fbg2468@gmail.com',
      to: bookingDetails.email,
      subject: 'Thank you for making a booking',
      html: htmlContent,
    };
    await sendEmail(emailOptions);
  } catch (error) {
    log.error(`Error converting diary: ${(error as Error).message}`);
    throw error;
  }
};

// sendBookingEmail({
//   name: 'test',
//   email: 'test@test.com',
//   date: DateTime.now().toISODate(),
//   time: DateTime.now().toISOTime(),
//   duration: 15,
//   type: 'Consultation',
// });

export default sendBookingEmail;
