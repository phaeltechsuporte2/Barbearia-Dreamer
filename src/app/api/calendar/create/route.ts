import { NextRequest, NextResponse } from "next/server";
import { createCalendarEvent } from "@/lib/google-calendar";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { summary, description, date, time, durationMinutes } = body;

    if (!summary || !date || !time || !durationMinutes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await createCalendarEvent({
      summary,
      description: description || "",
      date,
      time,
      durationMinutes,
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error creating calendar event:", JSON.stringify(error, Object.getOwnPropertyNames(error as object)));
    return NextResponse.json(
      { error: "Failed to create calendar event", details: String(error) },
      { status: 500 }
    );
  }
}
