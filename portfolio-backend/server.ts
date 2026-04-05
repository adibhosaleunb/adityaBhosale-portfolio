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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "5432"),
  ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

const app = express();
const PORT = process.env.PORT || 4000;

// Allow requests from the frontend origin (set via env in production)
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

// ── Routes ────────────────────────────────────────────────────

app.get("/api/profile", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM user_profile LIMIT 1");
    res.json(result.rows[0]);
  } catch {
    res.json({
      name: "Aditya Bhosale",
      title: "Full Stack Developer | IT Specialist | Java & Enterprise Application Engineer",
      bio: "Results-driven Full Stack Developer and IT Specialist with over six years of experience in full stack development, application support, and SDLC-driven delivery for regulated industries. Proficient in Java, Spring Boot, ReactJS, and Cloud Architecture.",
      avatar_url: "/assets/photos/Aditya_home.png",
      location: "Fredericton, NB, Canada",
      email: "adibhosale06@gmail.com",
      github_url: "https://github.com/adibhosaleunb",
      linkedin_url: "https://linkedin.com/in/adibhosale06",
    });
  }
});

app.get("/api/posts", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY published_at DESC");
    res.json(result.rows);
  } catch {
    res.json([
      { id: 1, title: "Quantifying the Energy Cost of Resilience", content: "Research publication exploring the trade-offs between system resilience and energy consumption.", category: "Research", published_at: new Date() },
      { id: 2, title: "Companion Chatbot", content: "AI-driven companion chatbots for enhanced user interaction.", category: "AI/ML", published_at: new Date() },
      { id: 3, title: "Migrating Monoliths to Microservices", content: "Strategies for migrating large-scale financial systems.", category: "Engineering", published_at: new Date() },
    ]);
  }
});

app.get("/api/projects", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
    res.json(result.rows);
  } catch {
    res.json([
      { id: 1, title: "Copart - Billing & Payments Platform", category: "FinTech", description: "High-volume billing and payments platform supporting real-time transactions, fraud detection, and payment processing through RESTful APIs and event-driven microservices.", tags: ["Java", "Spring Boot", "RESTful APIs", "Microservices", "Oracle", "PostgreSQL"], image: "/assets/projects/copart-logo.png", link: "#" },
      { id: 2, title: "Skyhigh Security - Cloud Security Compliance", category: "Security", description: "Cloud security and compliance applications with custom policy management, real-time alerting, and support for CIS, HIPAA, and NIST 800-53 compliance use cases.", tags: ["Java", "Spring Boot", "ReactJS", "AWS", "GCP", "Azure"], image: "/assets/projects/skyhigh-logo.png", link: "#" },
    ]);
  }
});

app.get("/api/experience", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM experience ORDER BY start_date DESC");
    res.json(result.rows);
  } catch {
    res.json([
      { id: 1, company: "Skyhigh Security", role: "Senior Software Development Engineer", period: "Jun 2025 – Oct 2025", description: "Built high-performance backend and frontend solutions for cloud security and compliance applications." },
      { id: 2, company: "Copart India Technology Centre", role: "Senior Software Engineer", period: "Dec 2021 – May 2025", description: "Delivered RESTful APIs and event-driven microservices for high-volume billing platforms." },
    ]);
  }
});

app.get("/api/skills", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM skills");
    res.json(result.rows);
  } catch {
    res.json([
      { category: "Core Systems", items: ["C++", "Rust", "Go", "Kernel Dev", "Distributed Systems"] },
      { category: "Intelligence", items: ["PyTorch", "TensorFlow", "CUDA", "LLMs", "Computer Vision"] },
      { category: "Cloud Native", items: ["Kubernetes", "Docker", "Terraform", "AWS", "gRPC"] },
      { category: "Data Engine", items: ["PostgreSQL", "Redis", "Kafka", "ElasticSearch", "GraphQL"] },
    ]);
  }
});

app.get("/api/stats", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stats");
    res.json(result.rows);
  } catch {
    res.json([
      { label: "Years of Systems Design", value: "07+" },
      { label: "Neural Architectures", value: "12+" },
      { label: "System Reliability", value: "99.9%" },
    ]);
  }
});

app.get("/api/education", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM education ORDER BY period DESC");
    res.json(result.rows);
  } catch {
    res.json([
      { degree: "Master of Computer Science (MCS)", institution: "University of New Brunswick", location: "Fredericton, NB", period: "Jan 2026 – Present", focus: "Distributed Systems & Resilience" },
      { degree: "Bachelor of Technology — CSE", institution: "SRM Institute of Science and Technology", location: "Chennai, India", period: "May 2015 – May 2019", focus: "Computer Science Engineering", gpa: "8.16/10" },
    ]);
  }
});

app.get("/api/ui-config", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ui_config");
    const config = result.rows.reduce((acc: Record<string, string>, row: { key: string; value: string }) => {
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

app.get("/api/download-resume", (_req, res) => {
  const resumePath = path.join(__dirname, "public", "resume.pdf");
  res.download(resumePath, "Aditya_Bhosale_Resume.pdf", (err) => {
    if (err) res.status(404).send("Resume not found.");
  });
});

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
