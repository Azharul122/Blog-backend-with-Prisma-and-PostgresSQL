# Blog backend

Backend service built with Node.js, TypeScript, Express, PostgreSQL, and Cloudinary for image uploads.

## Features

- Advanced post filtering — by tags, categories, specific date lists, and date ranges
- Search posts by title and content
- Sortable results (title, content, isFeatured) with ASC/DESC order
- Slug-based routing for posts
- Infinite (nested) comments
- Auto token storage in cookies — no manual token handling needed on the client
- Social login(Google)
- REST API with Express + TypeScript
- PostgreSQL database
- Email sending via SMTP (Nodemailer / Gmail App Password)
- Image upload & management via Cloudinary
- CORS-restricted allowed origins
- Admin seed on first run

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript (`tsx`)
- **Database:** PostgreSQL
- **Image Hosting:** Cloudinary
- **Email:** SMTP (Gmail App Password)

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- PostgreSQL database (local or hosted)
- Cloudinary account
- Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) enabled

### Installation

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

### Environment Variables

Create a `.env` file in the root directory (see `.env.example`) and fill in the following:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://user:password@host:port/dbname`) |
| `PORT` | Port the server runs on (default: `5000`) |
| `SMTP_EMAIL` | Gmail address used to send emails |
| `SMTP_APP_PASSWORD` | 16-character Gmail App Password (not your regular password) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins |
| `BASE_URL` | Base URL of the running server |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_MAIL` | Seeded admin email (used on first run) |
| `ADMIN_PASSWORD` | Seeded admin password (used on first run) |
| `ADMIN_NAME` | Seeded admin display name |

> ⚠️ **Never commit your real `.env` file.** Only commit a `.env.example` with placeholder values, and make sure `.env` is listed in `.gitignore`.

### Running the Project

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# Production mode
npm start

# Lint the codebase
npm run lint
```

The server will start on `http://localhost:5000` (or whatever `PORT` you set).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Runs the server in watch mode using `tsx` |
| `npm start` | Runs the server once using `tsx` |
| `npm run lint` | Lints the codebase with ESLint |

## License

This project is licensed under the MIT License.
