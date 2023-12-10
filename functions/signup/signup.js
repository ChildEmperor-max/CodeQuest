const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const supabase = createClient(
  "https://lijmzdfdpsabhpwqlfnh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpam16ZGZkcHNhYmhwd3FsZm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MDQzNzcsImV4cCI6MjAxNzA4MDM3N30.YJPUGL7jXFlf6SG_mE_k4cR9aVtnlUFNGqfVjnVb8ZM"
);
const HEADERS = {
  "content-type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400", // Adjust the value as needed
  Vary: "Origin", // Add the Vary header
};

const handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const { user_id, role, firstName, lastName, email, password, gender } =
      data;

    const { data: userDetails, error } = await supabase
      .from("user_details")
      .upsert(
        [{ user_id, role, firstName, lastName, email, password, gender }],
        {
          onConflict: ["user_id"],
          returning: ["*"],
        }
      );

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User details inserted successfully" }),
    };
  } catch (error) {
    console.error("Error inserting user details:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

module.exports = { handler };
