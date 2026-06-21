import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Diagnostic boot logs
console.log("--- REBOOT DIAGNOSTIC ---");
console.log("Is API_KEY string loaded?:", !!process.env.API_KEY);
console.log("Raw Key Prefix:", process.env.API_KEY ? process.env.API_KEY.substring(0, 5) + "..." : "NONE");
console.log("------------------------");

// Sending both direct & proxy keys safely to cover all configuration layouts
const headers = {
  "x-apisports-key": process.env.API_KEY,
  "x-rapidapi-key": process.env.API_KEY,
  "x-rapidapi-host": "v3.football.api-sports.io",
};

// LIVE MATCHES
export const getLiveMatches = async (req, res) => {
  try {
    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures",
      {
        headers,
        params: {
          live: "all",
        },
      }
    );

    res.status(200).json(response.data || { response: [] });

  } catch (error) {
    console.log("LIVE ERROR:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch live matches",
      error: error.response?.data || error.message,
    });
  }
};

// FIXTURES
export const getFixtures = async (req, res) => {
  try {
    const { league = 39, season = 2026 } = req.query;

    // Fixed the domain URL string here back to the core working host destination
    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures",
      {
        headers,
        params: {
          league,
          season,
        },
      }
    );

    res.status(200).json(response.data);

  } catch (error) {
    console.log("FIXTURE ERROR:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

// MATCH LINEUPS & BENCH
export const getMatchLineups = async (req, res) => {
  try {
    const { fixture } = req.query;

    if (!fixture) {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: fixture (Fixture ID)",
      });
    }

    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures/lineups",
      {
        headers,
        params: {
          fixture,
        },
      }
    );

    res.status(200).json(response.data);

  } catch (error) {
    console.log("LINEUP ERROR:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch match lineups",
      error: error.response?.data || error.message,
    });
  }
};