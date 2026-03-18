# Patliputra Auto — Backend API Documentation

## Base URL
```
https://api.patliputraauto.com/api/v1
```

Configure in Admin Settings or set `VITE_API_BASE_URL` in your frontend `.env`.

---

## Authentication

### POST `/auth/login`
Admin login.

**Request Body:**
```json
{
  "email": "admin@patliputraauto.com",
  "password": "your_password"
}
```

**Response `200`:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9",
    "name": "Admin",
    "email": "admin@patliputraauto.com",
    "role": "admin"
  }
}
```

**Response `401`:**
```json
{ "success": false, "message": "Invalid credentials" }
```

> **Note:** All admin endpoints below require `Authorization: Bearer <token>` header.

---

## Leads

### Model Schema — `Lead`
```javascript
// models/Lead.js
const leadSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true, maxlength: 100 },
  mobile:          { type: String, required: true, trim: true, maxlength: 15 },
  email:           { type: String, trim: true, lowercase: true, maxlength: 255 },
  city:            { type: String, default: "Patna" },
  model:           { type: String, enum: ["VF 6", "VF 7"], required: true },
  source:          { type: String, enum: ["Website", "Google Ads", "Meta Ads", "WhatsApp", "Walk-in", "Referral", "Campaign"], default: "Website" },
  status:          { type: String, enum: ["New Lead", "Contact Attempted", "Interested", "Test Drive Scheduled", "Negotiation", "Booked", "Lost", "Dormant"], default: "New Lead" },
  assignedTo:      { type: String, default: "" },
  nextFollowUp:    { type: Date },
  remarks:         { type: String, maxlength: 500 },
  financeNeeded:   { type: Boolean, default: false },
  exchangeNeeded:  { type: Boolean, default: false },
  lostReason:      { type: String, enum: ["", "high_price", "competitor_chosen", "no_finance", "charging_concern", "delayed_decision", "out_of_territory", "not_reachable", "exchange_issue"], default: "" },
  // UTM tracking
  utmSource:       { type: String },
  utmMedium:       { type: String },
  utmCampaign:     { type: String },
  pageSource:      { type: String },
  // Auto fields
  leadScore:       { type: Number, default: 0 },
}, { timestamps: true });
```

### GET `/leads`
Get all leads with pagination, search, and filters.

**Query Parameters:**
| Param      | Type     | Description                          |
|------------|----------|--------------------------------------|
| `page`     | number   | Page number (default: 1)             |
| `limit`    | number   | Per page (default: 20, max: 100)     |
| `search`   | string   | Search in name, mobile, email        |
| `status`   | string   | Filter by lead status                |
| `model`    | string   | Filter by model ("VF 6" or "VF 7")  |
| `source`   | string   | Filter by lead source                |
| `city`     | string   | Filter by city                       |
| `assignedTo` | string | Filter by assigned executive         |
| `sortBy`   | string   | Sort field (default: "createdAt")    |
| `sortOrder`| string   | "asc" or "desc" (default: "desc")    |
| `fromDate` | string   | ISO date — leads from this date      |
| `toDate`   | string   | ISO date — leads up to this date     |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9",
      "name": "Rahul Kumar",
      "mobile": "9876543210",
      "email": "rahul@email.com",
      "city": "Patna",
      "model": "VF 7",
      "source": "Google Ads",
      "status": "New Lead",
      "assignedTo": "Amit",
      "nextFollowUp": "2026-03-18T00:00:00.000Z",
      "remarks": "Interested in top variant",
      "financeNeeded": true,
      "exchangeNeeded": false,
      "createdAt": "2026-03-15T10:30:00.000Z",
      "updatedAt": "2026-03-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### GET `/leads/:id`
Get single lead by ID.

### POST `/leads`
Create a new lead. **Used by public forms (test drive, get price, contact).**

> This endpoint should be **public** (no auth required) for customer-facing forms.

**Request Body:**
```json
{
  "name": "Rahul Kumar",
  "mobile": "9876543210",
  "email": "rahul@email.com",
  "city": "Patna",
  "model": "VF 7",
  "source": "Website",
  "remarks": "Interested in VF 7 Plus",
  "financeNeeded": true,
  "exchangeNeeded": false,
  "pageSource": "/test-drive",
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "bihar_launch"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { "_id": "64a1b2c3d4e5f6g7h8i9", "...": "..." }
}
```

### PUT `/leads/:id`
Update a lead (admin only).

**Request Body (partial update):**
```json
{
  "status": "Interested",
  "assignedTo": "Suresh",
  "nextFollowUp": "2026-03-20",
  "remarks": "Called, interested in VF 7 Plus"
}
```

### DELETE `/leads/:id`
Delete a lead (admin only).

### GET `/leads/stats`
Dashboard statistics (admin only).

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "byStatus": {
      "New Lead": 12,
      "Contact Attempted": 5,
      "Interested": 8,
      "Test Drive Scheduled": 6,
      "Negotiation": 4,
      "Booked": 3,
      "Lost": 5,
      "Dormant": 2
    },
    "bySource": {
      "Google Ads": 15,
      "Website": 10,
      "WhatsApp": 8,
      "Meta Ads": 5,
      "Walk-in": 4,
      "Referral": 3
    },
    "byModel": { "VF 7": 25, "VF 6": 20 },
    "byCity": { "Patna": 30, "Gaya": 5, "Muzaffarpur": 4, "Others": 6 },
    "todayLeads": 3,
    "pendingFollowUps": 8,
    "conversionRate": 6.67
  }
}
```

---

## Test Drives

### Model Schema — `TestDrive`
```javascript
// models/TestDrive.js
const testDriveSchema = new mongoose.Schema({
  lead:              { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  customerName:      { type: String, required: true, trim: true },
  mobile:            { type: String, required: true },
  email:             { type: String },
  model:             { type: String, enum: ["VF 6", "VF 7"], required: true },
  preferredDate:     { type: Date, required: true },
  preferredTime:     { type: String, required: true },
  branch:            { type: String, default: "Patna Showroom" },
  status:            { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled", "Rescheduled"], default: "Pending" },
  assignedExecutive: { type: String, default: "" },
  assignedVehicle:   { type: String },
  feedback:          { type: String, maxlength: 500 },
  rating:            { type: Number, min: 1, max: 5 },
  // UTM
  pageSource:        { type: String },
  utmSource:         { type: String },
  utmCampaign:       { type: String },
}, { timestamps: true });
```

### GET `/test-drives`
List all test drive bookings (admin, paginated + filterable).

**Query Parameters:** `page`, `limit`, `status`, `model`, `branch`, `fromDate`, `toDate`, `search`

### GET `/test-drives/:id`
Get single test drive booking.

### POST `/test-drives`
Create test drive booking. **Public endpoint** for customer form.

**Request Body:**
```json
{
  "customerName": "Rahul Kumar",
  "mobile": "9876543210",
  "email": "rahul@email.com",
  "model": "VF 7",
  "preferredDate": "2026-03-20",
  "preferredTime": "10:00 AM",
  "branch": "Patna Showroom",
  "pageSource": "/test-drive",
  "utmSource": "google"
}
```

### PUT `/test-drives/:id`
Update booking (admin — status, assignment, feedback).

### PUT `/test-drives/:id/status`
Quick status update.

**Request Body:**
```json
{ "status": "Confirmed" }
```

### DELETE `/test-drives/:id`
Delete booking (admin only).

---

## Enquiries

### Model Schema — `Enquiry`
```javascript
// models/Enquiry.js
const enquirySchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  mobile:  { type: String, required: true },
  email:   { type: String },
  type:    { type: String, enum: ["General", "Get Price", "Finance", "Exchange", "Corporate", "Service", "Callback"], required: true },
  model:   { type: String },
  message: { type: String, maxlength: 1000 },
  status:  { type: String, enum: ["Open", "Responded", "Closed"], default: "Open" },
  // UTM
  pageSource: { type: String },
  utmSource:  { type: String },
  utmCampaign:{ type: String },
}, { timestamps: true });
```

### GET `/enquiries`
List all enquiries (admin, paginated + filterable).

### POST `/enquiries`
Submit enquiry. **Public endpoint.**

**Request Body:**
```json
{
  "name": "Arun Jha",
  "mobile": "9876543220",
  "email": "arun@email.com",
  "type": "Get Price",
  "model": "VF 7",
  "message": "Want on-road price for VF 7 Plus in Patna"
}
```

### PUT `/enquiries/:id`
Update enquiry status (admin).

### DELETE `/enquiries/:id`
Delete enquiry (admin).

---

## Products

### Model Schema — `Product`
```javascript
// models/Product.js
const productSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  tagline:   { type: String },
  slug:      { type: String, unique: true },
  priceFrom: { type: String },
  range:     { type: String },
  battery:   { type: String },
  power:     { type: String },
  safety:    { type: String },
  variants:  { type: String },
  colors:    [{ name: String, hex: String, image: String }],
  specs:     {
    performance: { type: Map, of: String },
    battery:     { type: Map, of: String },
    dimensions:  { type: Map, of: String },
    safety:      { type: Map, of: String },
  },
  images:    {
    hero:     { type: String },
    gallery:  [String],
    interior: [String],
  },
  brochureUrl: { type: String },
  active:      { type: Boolean, default: true },
}, { timestamps: true });
```

### GET `/products`
List all products. **Public.**

### GET `/products/:slug`
Get product by slug (e.g., `vf-7`). **Public.**

### POST `/products`
Create product (admin).

### PUT `/products/:id`
Update product (admin).

### DELETE `/products/:id`
Delete product (admin).

---

## Offers

### Model Schema — `Offer`
```javascript
// models/Offer.js
const offerSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  model:       { type: String, default: "All Models" },
  type:        { type: String, enum: ["Launch", "Exchange", "Finance", "Accessory", "Festive", "Referral"], default: "Launch" },
  validFrom:   { type: Date },
  validTill:   { type: Date, required: true },
  active:      { type: Boolean, default: true },
  couponCode:  { type: String },
  city:        { type: String },
  image:       { type: String },
}, { timestamps: true });
```

### GET `/offers`
List active offers. **Public** (returns only `active: true`).

### GET `/offers/all`
List all offers including inactive (admin).

### POST `/offers`
Create offer (admin).

### PUT `/offers/:id`
Update offer (admin).

### PUT `/offers/:id/toggle`
Toggle active status (admin).

### DELETE `/offers/:id`
Delete offer (admin).

---

## Content

### Banners — `Banner`
```javascript
const bannerSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  subtitle: { type: String },
  imageUrl: { type: String, required: true },
  link:     { type: String },
  order:    { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });
```

| Method | Endpoint           | Auth   | Description         |
|--------|--------------------|--------|---------------------|
| GET    | `/banners`         | Public | Active banners      |
| GET    | `/banners/all`     | Admin  | All banners         |
| POST   | `/banners`         | Admin  | Create banner       |
| PUT    | `/banners/:id`     | Admin  | Update banner       |
| DELETE | `/banners/:id`     | Admin  | Delete banner       |

### FAQs — `FAQ`
```javascript
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
  category: { type: String },
  order:    { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });
```

| Method | Endpoint       | Auth   | Description   |
|--------|----------------|--------|---------------|
| GET    | `/faqs`        | Public | Active FAQs   |
| POST   | `/faqs`        | Admin  | Create FAQ    |
| PUT    | `/faqs/:id`    | Admin  | Update FAQ    |
| DELETE | `/faqs/:id`    | Admin  | Delete FAQ    |

### Testimonials — `Testimonial`
```javascript
const testimonialSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  city:    { type: String },
  model:   { type: String },
  rating:  { type: Number, min: 1, max: 5 },
  text:    { type: String, required: true },
  image:   { type: String },
  videoUrl:{ type: String },
  active:  { type: Boolean, default: true },
}, { timestamps: true });
```

| Method | Endpoint              | Auth   | Description          |
|--------|-----------------------|--------|----------------------|
| GET    | `/testimonials`       | Public | Active testimonials  |
| POST   | `/testimonials`       | Admin  | Create testimonial   |
| PUT    | `/testimonials/:id`   | Admin  | Update testimonial   |
| DELETE | `/testimonials/:id`   | Admin  | Delete testimonial   |

---

## Brochure Downloads

### POST `/brochure-downloads`
Track brochure download with lead capture. **Public.**

```json
{
  "name": "Rahul",
  "mobile": "9876543210",
  "email": "rahul@email.com",
  "model": "VF 7"
}
```

---

## Settings

### Model Schema — `Setting`
```javascript
const settingSchema = new mongoose.Schema({
  dealerName:    { type: String },
  brand:         { type: String },
  phone:         { type: String },
  email:         { type: String },
  whatsapp:      { type: String },
  address:       { type: String },
  gstNo:         { type: String },
  showroomHours: { type: String },
  mapEmbedUrl:   { type: String },
  socialLinks:   {
    facebook:  String,
    instagram: String,
    youtube:   String,
    linkedin:  String,
  },
  seoDefaults: {
    title:       String,
    description: String,
    keywords:    String,
  },
}, { timestamps: true });
```

| Method | Endpoint     | Auth  | Description      |
|--------|--------------|-------|------------------|
| GET    | `/settings`  | Public| Get settings     |
| PUT    | `/settings`  | Admin | Update settings  |

---

## Users (Admin Team)

### Model Schema — `User`
```javascript
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  role:     { type: String, enum: ["admin", "sales_manager", "sales_executive", "telecaller", "service_advisor"], required: true },
  branch:   { type: String },
  phone:    { type: String },
  active:   { type: Boolean, default: true },
}, { timestamps: true });
```

| Method | Endpoint       | Auth  | Description       |
|--------|----------------|-------|-------------------|
| GET    | `/users`       | Admin | List team members |
| POST   | `/users`       | Admin | Create user       |
| PUT    | `/users/:id`   | Admin | Update user       |
| DELETE | `/users/:id`   | Admin | Deactivate user   |

---

## Standard Error Response
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [
    { "field": "mobile", "message": "Mobile number is required" }
  ]
}
```

## HTTP Status Codes Used
| Code | Meaning                |
|------|------------------------|
| 200  | Success                |
| 201  | Created                |
| 400  | Validation error       |
| 401  | Unauthorized           |
| 403  | Forbidden              |
| 404  | Not found              |
| 429  | Rate limited           |
| 500  | Internal server error  |

---

## Middleware Recommendations

```
├── middleware/
│   ├── auth.js           // JWT verification
│   ├── adminOnly.js      // Role check
│   ├── rateLimiter.js    // Rate limit public endpoints
│   ├── validator.js      // Input validation (use Joi or express-validator)
│   └── errorHandler.js   // Global error handler
```

## Suggested Folder Structure

```
server/
├── config/
│   └── db.js                 // MongoDB connection
├── models/
│   ├── Lead.js
│   ├── TestDrive.js
│   ├── Enquiry.js
│   ├── Product.js
│   ├── Offer.js
│   ├── Banner.js
│   ├── FAQ.js
│   ├── Testimonial.js
│   ├── Setting.js
│   └── User.js
├── controllers/
│   ├── authController.js
│   ├── leadController.js
│   ├── testDriveController.js
│   ├── enquiryController.js
│   ├── productController.js
│   ├── offerController.js
│   ├── contentController.js
│   ├── settingController.js
│   └── userController.js
├── routes/
│   ├── authRoutes.js
│   ├── leadRoutes.js
│   ├── testDriveRoutes.js
│   ├── enquiryRoutes.js
│   ├── productRoutes.js
│   ├── offerRoutes.js
│   ├── contentRoutes.js
│   ├── settingRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── auth.js
│   ├── adminOnly.js
│   ├── rateLimiter.js
│   ├── validator.js
│   └── errorHandler.js
├── utils/
│   ├── sendSMS.js
│   ├── sendEmail.js
│   └── whatsapp.js
├── server.js
├── .env
└── package.json
```

## Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/patliputra_auto
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=https://patliputraauto.com
```

## Frontend Integration Point

Set the API base URL in the frontend admin settings page, or configure it in your environment. The frontend currently uses mock data in `src/data/mockData.ts` — replace those with API calls using `fetch` or `axios` to these endpoints.
