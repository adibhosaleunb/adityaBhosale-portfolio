import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// ── Database ────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "5432"),
  ssl:
    process.env.PGSSLMODE === "require"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// ── App Setup ───────────────────────────────────────────────
const app = express();

// CORS setup
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET"],
    credentials: true,
  })
);

app.use(express.json());

// ── Routes ─────────────────────────────────────────────────

app.get("/aditya/profile", async (req, res) => {
 
  try {
    const result = await pool.query("SELECT * FROM user_profile LIMIT 1");
    res.json(result.rows[0]);
  } catch {
    res.json({
      name: "Aditya Bhosale",
      title:
        "Full Stack Developer | IT Specialist | Java & Enterprise Application Engineer",
      bio:
        "Results-driven Full Stack Developer and IT Specialist with over six years of experience in full stack development, application support, and SDLC-driven delivery.",
      avatar_url: "/assets/photos/Aditya_home.png",
      location: "Fredericton, NB, Canada",
      email: "adibhosale06@gmail.com",
      github_url: "https://github.com/adibhosaleunb",
      linkedin_url: "https://linkedin.com/in/adibhosale06",
    });
  }
 
});

app.get("/", async (req, res) => {
 
  try {
 
    res.json({ message: `Welcome to the Aditya Bhosale Portfolio` });
    // res.json(products);
  } catch (err) {
    console.error(err);
    res.json({ message: `Welcome to the Aditya Bhosale Portfolio` });
  }
 
});


// Profile
app.get("/api/profile", async (_req, res) => {
  // try {
  //   const result = await pool.query("SELECT * FROM user_profile LIMIT 1");
  //   res.json(result.rows[0]);
  // } catch {
  //   res.json({
  //     name: "Aditya Bhosale",
  //     title:
  //       "Full Stack Developer | IT Specialist | Java & Enterprise Application Engineer",
  //     bio:
  //       "Results-driven Full Stack Developer and IT Specialist with over six years of experience in full stack development, application support, and SDLC-driven delivery.",
  //     avatar_url: "/assets/photos/Aditya_home.png",
  //     location: "Fredericton, NB, Canada",
  //     email: "adibhosale06@gmail.com",
  //     github_url: "https://github.com/adibhosaleunb",
  //     linkedin_url: "https://linkedin.com/in/adibhosale06",
  //   });
  // }

   res.json({ message: `Welcome to the Aditya Bhosale Portfolio /api/portfolio` });
});

// Posts
app.get("/api/posts", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY published_at DESC"
    );
    res.json(result.rows);
  } catch {
    res.json([
      {
        id: 1,
        title: "Quantifying the Energy Cost of Resilience",
        content:
          "Research publication exploring trade-offs between resilience and energy consumption.",
        category: "Research",
        published_at: new Date(),
      },
    ]);
  }
});

// Projects
app.get("/api/projects", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch {
    res.json([
      {
        id: 1,
        title: "Copart - Billing Platform",
        category: "FinTech",
        description:
          "High-volume billing and payments platform using microservices.",
        tags: ["Java", "Spring Boot", "Microservices"],
        image: "/assets/projects/copart-logo.png",
        link: "#",
      },
    ]);
  }
});

// Experience
app.get("/api/experience", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM experience ORDER BY start_date DESC"
    );
    res.json(result.rows);
  } catch {
    res.json([
      {
        id: 1,
        company: "Skyhigh Security",
        role: "Senior Software Engineer",
        period: "2025",
        description: "Worked on cloud security systems.",
      },
    ]);
  }
});

// Skills
app.get("/api/skills", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM skills");
    res.json(result.rows);
  } catch {
    res.json([
      { category: "Backend", items: ["Java", "Spring Boot"] },
      { category: "Cloud", items: ["AWS", "Docker"] },
    ]);
  }
});

// Stats
app.get("/api/stats", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stats");
    res.json(result.rows);
  } catch {
    res.json([
      { label: "Experience", value: "6+ Years" },
      { label: "Projects", value: "10+" },
    ]);
  }
});

// Education
app.get("/api/education", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM education ORDER BY period DESC"
    );
    res.json(result.rows);
  } catch {
    res.json([
      {
        degree: "MCS",
        institution: "UNB",
        period: "2026",
      },
    ]);
  }
});

// UI Config (FIXED JS VERSION)
app.get("/api/ui-config", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ui_config");

    const config = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    res.json(config);
  } catch {
    res.json({
      version: "Aditya Bhosale",
      nav_items: '["Home", "Skills", "Experience", "Contact me"]',
    });
  }
});

// Resume Download
app.get("/api/download-resume", (_req, res) => {
  const resumePath = path.join(__dirname, "public", "resume.pdf");

  res.download(resumePath, "Aditya_Bhosale_Resume.pdf", (err) => {
    if (err) res.status(404).send("Resume not found.");
  });
});

// Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}


// ── Export for Vercel ───────────────────────────────────────
export default app;