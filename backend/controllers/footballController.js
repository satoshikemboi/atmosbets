import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Diagnostic boot logs
console.log("--- REBOOT DIAGNOSTIC ---");
console.log("Is API_KEY string loaded?:", !!process.env.API_KEY);
console.log("Raw Key Prefix:", process.env.API_KEY ? process.env.API_KEY.substring(0, 5) + "..." : "NONE");
console.log("------------------------");

// 🟢 FIXED: Football-Data.org expects the key inside the X-Auth-Token header
const headers = {
  "X-Auth-Token": process.env.API_KEY,
};

// GET UNIFIED MATCH TIMELINE (Replaces getLiveMatches and getFixtures)
export const getMatches = async (req, res) => {
  try {
    const { competition } = req.query; // Expects Football-Data codes like 'PL', 'PD', 'BL1'

    // If a specific competition string is provided, use its direct sub-resource endpoint.
    // Otherwise, fetch globally across all available divisions.
    const url = competition
      ? `https://api.football-data.org/v4/competitions/${competition}/matches`
      : `https://api.football-data.org/v4/matches`;

    console.log(`FETCHING FROM FOOTBALL-DATA: ${url}`);

    const response = await axios.get(url, { headers });

    // Send the structured object downstream to the frontend
    res.status(200).json(response.data || { matches: [] });

  } catch (error) {
    console.log("MATCH ENGINE ERROR:", error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: "Failed to load football-data matches",
      error: error.response?.data || error.message,
    });
  }
};