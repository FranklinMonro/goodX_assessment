import nodemailer from 'nodemailer';

import { nodemailerLogger as log } from './winston';
// Interface for email options
export interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: import('nodemailer/lib/mailer').Attachment[]; // Optional attachments
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const transporter = nodemailer.createTransport({
    host: 'maildev', // SMTP host
    port: 1025, // SMTP port
  });

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail(options);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    log.error('Error sending email:', error);
    console.error('Error sending email:', error);
    throw error;
  }
};
