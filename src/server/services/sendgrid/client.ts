import { env } from "@/env.mjs";
import { MailService } from "@sendgrid/mail";

export const sendgrid = new MailService();

sendgrid.setApiKey(env.SENDGRID_API_KEY);
