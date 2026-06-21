import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const headers = {
  "x-rapidapi-key": process.env.API_KEY,
  "x-rapidapi-host": "v3.football.api-sports.io",
  "x-apisports-key": process.env.API_KEY,
};

// LIVE MATCHES
export const getLiveMatches = async (req, res) => {
  try {
    console.log("API key loaded:", !!process.env.API_KEY);

    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures",
      {
        headers,
        params: {
          live: "all",
        },
      }
    );

    res.status(200).json(response.data || { response: []});

  } catch (error) {
    console.log(
      "LIVE ERROR:",
      error.response?.data ||
      error.message
    );

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
    const {
      league = 39,
      season = 2026,
    } = req.query;

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
    console.log(
      "FIXTURE ERROR:",
      error.response?.data ||
      error.message
    );

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

// --- NEW: MATCH LINEUPS & BENCH ---
export const getMatchLineups = async (req, res) => {
  try {
    // Expecting the frontend to pass ?fixture=123456
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
          fixture, // This is the API-Football Match/Fixture ID
        },
      }
    );

    res.status(200).json(response.data);

  } catch (error) {
    console.log(
      "LINEUP ERROR:",
      error.response?.data ||
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch match lineups",
      error: error.response?.data || error.message,
    });
  }
};