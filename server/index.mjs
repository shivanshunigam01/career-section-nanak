/**
 * Dev / test API for public site forms.
 * POST /api/v1/leads | /test-drives | /enquiries
 * GET  /api/v1/health
 * GET  /api/v1/live  |  GET /live  — JSON: proves API is reachable on this host (test in browser)
 * GET  /  — simple HTML “live” page for the same check
 * GET  /api/v1/forms-debug/recent  (last captured submissions — local testing only)
 *
 * Run: npm run api
 * Frontend: VITE_API_URL=http://localhost:5000/api/v1
 */
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const PORT = Number(process.env.FORMS_API_PORT || process.env.PORT || 5000);

const recent = {
  leads: [],
  testDrives: [],
  enquiries: [],
};
const MAX_RECENT = 80;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function appendRecord(kind, record) {
  ensureDataDir();
  const file = path.join(DATA_DIR, `${kind}.jsonl`);
  fs.appendFileSync(file, JSON.stringify(record) + "\n", "utf8");
}

function pushRecent(kind, entry) {
  const arr = recent[kind];
  arr.unshift(entry);
  if (arr.length > MAX_RECENT) arr.length = MAX_RECENT;
}

function ok(res, data, message) {
  res.status(201).json({ success: true, data: data ?? {}, message: message ?? "Created" });
}

function bad(res, message, status = 400, errors) {
  res.status(status).json({ success: false, message, errors });
}

function requireMobile(body) {
  const m = String(body.mobile ?? "").replace(/\D/g, "").slice(0, 10);
  if (!/^[6-9]\d{9}$/.test(m)) {
    return { error: "Valid 10-digit Indian mobile required (starts with 6–9)." };
  }
  return { mobile: m };
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "256kb" }));

/** JSON you can open in the browser to confirm the API is live on this domain. */
function liveJson(req) {
  const host = req.get("host") || "";
  const xfHost = req.get("x-forwarded-host") || "";
  const xfProto = req.get("x-forwarded-proto") || "";
  const proto = xfProto || req.protocol || "http";
  const visibleHost = xfHost || host;
  return {
    live: true,
    ok: true,
    service: "vinfast-forms-api",
    message: "API is reachable on this host.",
    time: new Date().toISOString(),
    host: host || null,
    forwardedHost: xfHost || null,
    publicBaseUrl: visibleHost ? `${proto}://${visibleHost.split(",")[0].trim()}` : null,
    path: req.path,
    nodeEnv: process.env.NODE_ENV || "development",
  };
}

app.get("/", (req, res) => {
  const j = liveJson(req);
  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>API live — Patliputra VinFast</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
    .ok { color: #0a0; font-weight: 700; }
    code { background: #f4f4f5; padding: 0.15rem 0.4rem; border-radius: 4px; }
    a { color: #c41230; }
  </style>
</head>
<body>
  <p class="ok">Live</p>
  <p>This server is running and reached you at <code>${escapeHtml(j.host || "—")}</code>.</p>
  <p>Server time (UTC): <code>${escapeHtml(j.time)}</code></p>
  <p>JSON check: <a href="/api/v1/live"><code>/api/v1/live</code></a> or <a href="/live"><code>/live</code></a></p>
</body>
</html>`);
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.get("/api/v1/live", (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.json(liveJson(req));
});

app.get("/live", (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.json(liveJson(req));
});

app.get("/api/v1/health", (req, res) => {
  res.json({
    ok: true,
    live: true,
    service: "vinfast-forms-api",
    time: new Date().toISOString(),
    host: req.get("host") || null,
    port: PORT,
  });
});

app.get("/api/v1/forms-debug/recent", (_req, res) => {
  res.json({
    leads: recent.leads,
    testDrives: recent.testDrives,
    enquiries: recent.enquiries,
    files: {
      leads: path.join(DATA_DIR, "leads.jsonl"),
      testDrives: path.join(DATA_DIR, "test-drives.jsonl"),
      enquiries: path.join(DATA_DIR, "enquiries.jsonl"),
    },
  });
});

app.post("/api/v1/leads", (req, res) => {
  const body = req.body ?? {};
  const name = String(body.name ?? "").trim();
  if (!name) return bad(res, "Name is required.");
  const mob = requireMobile(body);
  if (mob.error) return bad(res, mob.error);

  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const row = {
    id,
    receivedAt: new Date().toISOString(),
    name,
    mobile: mob.mobile,
    email: body.email ? String(body.email).trim() : undefined,
    city: body.city != null ? String(body.city).trim() : undefined,
    otherCity: body.otherCity ? String(body.otherCity).trim() : undefined,
    model: body.model != null ? String(body.model).trim() : undefined,
    interest: body.interest ? String(body.interest).trim() : undefined,
    source: body.source ? String(body.source).trim() : "Website",
    remarks: body.remarks ? String(body.remarks).trim() : undefined,
    financeNeeded: Boolean(body.financeNeeded),
    exchangeNeeded: Boolean(body.exchangeNeeded),
    pageSource: body.pageSource ? String(body.pageSource).trim() : undefined,
  };

  appendRecord("leads", row);
  pushRecent("leads", row);
  console.log("[leads]", row.source, row.name, row.mobile, row.model ?? "");
  ok(res, { id: row.id, receivedAt: row.receivedAt }, "Lead captured");
});

app.post("/api/v1/test-drives", (req, res) => {
  const body = req.body ?? {};
  const customerName = String(body.customerName ?? "").trim();
  if (!customerName) return bad(res, "Customer name is required.");
  const mob = requireMobile(body);
  if (mob.error) return bad(res, mob.error);
  const preferredDate = String(body.preferredDate ?? "").trim();
  if (!preferredDate) return bad(res, "Preferred date is required.");

  const id = `td_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const row = {
    id,
    receivedAt: new Date().toISOString(),
    customerName,
    mobile: mob.mobile,
    email: body.email ? String(body.email).trim() : undefined,
    model: body.model != null ? String(body.model).trim() : undefined,
    city: body.city ? String(body.city).trim() : undefined,
    preferredDate,
    preferredTime: body.preferredTime ? String(body.preferredTime).trim() : undefined,
    branch: body.branch ? String(body.branch).trim() : undefined,
    remarks: body.remarks ? String(body.remarks).trim() : undefined,
    pageSource: body.pageSource ? String(body.pageSource).trim() : undefined,
  };

  appendRecord("test-drives", row);
  pushRecent("testDrives", row);
  console.log("[test-drives]", row.customerName, row.mobile, row.preferredDate);
  ok(res, { id: row.id, receivedAt: row.receivedAt }, "Test drive request captured");
});

app.post("/api/v1/enquiries", (req, res) => {
  const body = req.body ?? {};
  const name = String(body.name ?? "").trim();
  if (!name) return bad(res, "Name is required.");
  const mob = requireMobile(body);
  if (mob.error) return bad(res, mob.error);
  const interest = String(body.interest ?? "").trim();
  if (!interest) return bad(res, "Interest / subject is required.");

  const id = `enq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const row = {
    id,
    receivedAt: new Date().toISOString(),
    name,
    mobile: mob.mobile,
    email: body.email ? String(body.email).trim() : undefined,
    city: body.city ? String(body.city).trim() : undefined,
    model: body.model != null ? String(body.model).trim() : undefined,
    interest,
    message: body.message ? String(body.message).trim() : undefined,
    source: body.source ? String(body.source).trim() : "Contact Form",
  };

  appendRecord("enquiries", row);
  pushRecent("enquiries", row);
  console.log("[enquiries]", row.interest, row.name, row.mobile);
  ok(res, { id: row.id, receivedAt: row.receivedAt }, "Enquiry captured");
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Not found: ${req.method} ${req.path}` });
});

ensureDataDir();
app.listen(PORT, () => {
  console.log(`Forms API: http://localhost:${PORT}/api/v1`);
  console.log(`  POST .../leads  |  .../test-drives  |  .../enquiries`);
  console.log(`  GET  /  (HTML)  |  .../live  |  .../health  |  .../forms-debug/recent`);
  console.log(`  JSONL: ${DATA_DIR}`);
});
