import { MailService } from "@sendgrid/mail";

import { env } from "@/env.mjs";

export const sendgrid = new MailService();

sendgrid.setApiKey(env.SENDGRID_API_KEY);
