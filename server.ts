import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Proxy for Google Places
  app.get("/api/places/nearby", async (req, res) => {
    const { location, radius, type } = req.query;
    const apiKey = process.env.VITE_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Maps API key missing" });
    }

    try {
      const params = new URLSearchParams({
        location: location as string,
        radius: radius as string,
        type: type as string,
        key: apiKey,
      });

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`
      );
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Places API Proxy error:", error);
      res.status(500).json({ error: "Failed to fetch from Google Places API" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
