import session from "express-session";
import { longTermSession, shortTermSession } from "../config/session.js";

export const OtpSessionMiddleware = session(shortTermSession);
export const UserSessionMiddleware = session(longTermSession);
