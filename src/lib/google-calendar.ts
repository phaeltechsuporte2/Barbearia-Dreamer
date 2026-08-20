import { google } from "googleapis";

const calendarId = process.env.GOOGLE_CALENDAR_ID!;
const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")!;

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  
  if (!email || !key) {
    throw new Error(`Missing Google Calendar env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL=${email ? 'SET' : 'MISSING'}, GOOGLE_PRIVATE_KEY=${key ? 'SET' : 'MISSING'}`);
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: key.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

export async function getAvailableSlots(date: string) {
  const calId = process.env.GOOGLE_CALENDAR_ID;
  if (!calId) {
    throw new Error("Missing GOOGLE_CALENDAR_ID env var");
  }

  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const startOfDay = new Date(`${date}T09:00:00`);
  const endOfDay = new Date(`${date}T19:00:00`);

  const response = await calendar.events.list({
    calendarId,
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const busySlots = response.data.items?.map((event) => ({
    start: event.start?.dateTime || event.start?.date || "",
    end: event.end?.dateTime || event.end?.date || "",
  })) || [];

  const allSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  ];

  const availableSlots = allSlots.filter((slot) => {
    const slotStart = new Date(`${date}T${slot}:00`);
    const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

    return !busySlots.some((busy) => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      return slotStart < busyEnd && slotEnd > busyStart;
    });
  });

  return availableSlots;
}

export async function createCalendarEvent(event: {
  summary: string;
  description: string;
  date: string;
  time: string;
  durationMinutes: number;
}) {
  const calId = process.env.GOOGLE_CALENDAR_ID;
  if (!calId) {
    throw new Error("Missing GOOGLE_CALENDAR_ID env var");
  }

  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const startDateTime = new Date(`${event.date}T${event.time}:00`);
  const endDateTime = new Date(
    startDateTime.getTime() + event.durationMinutes * 60 * 1000
  );

  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
    },
  });

  return response.data;
}

export async function deleteCalendarEvent(eventId: string) {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.delete({
    calendarId,
    eventId,
  });
}
