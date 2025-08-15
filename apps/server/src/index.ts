import "dotenv/config";
import cors from "cors";
import express from "express";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { appRouter } from "./routers/index";
import { getOTPEmailTemplate, sendEmail } from "./lib/mailer";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.all("/api/auth{/*path}", toNodeHandler(auth));



app.use(express.json());


app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.use("/api/v1", appRouter.users);

// Test email endpoint (remove in production)
app.post('/api/test-email', async (req: any, res: any) => {
  try {
    const { email, type = 'sign-in' } = req.body;
    const testOTP = '123456';

    const { html, text, subject } = getOTPEmailTemplate(testOTP, type);

    const result = await sendEmail({
      to: email,
      subject: `[TEST] ${subject}`,
      html,
      text,
    });

    res.json({ success: true, message: 'Test email sent!', result });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});