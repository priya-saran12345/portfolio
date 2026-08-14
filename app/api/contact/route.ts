import { NextRequest, NextResponse } from "next/server";

/**
 * Handles contact form submissions.
 *
 * Out of the box this just validates input and logs the message on the
 * server — enough to demo the flow locally. To actually receive emails,
 * wire this up to one of:
 *
 *  1. Formspree / Web3Forms (no backend needed): forward `data` with a
 *     fetch() call to their endpoint using an access key from an env var.
 *  2. Resend / Nodemailer: send an email directly from this route using
 *     your own SMTP or the Resend API + an API key from an env var.
 *
 * Never hardcode API keys — put them in `.env.local` and read them with
 * process.env.YOUR_KEY_NAME (see .env.example).
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are all required." },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // --- Example: forward to Formspree (uncomment and set FORMSPREE_ID) ---
    // const formspreeId = process.env.FORMSPREE_ID;
    // if (formspreeId) {
    //   const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json", Accept: "application/json" },
    //     body: JSON.stringify({ name, email, message }),
    //   });
    //   if (!res.ok) throw new Error("Failed to forward message.");
    // }

    console.log("New contact form submission:", { name, email, message });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
