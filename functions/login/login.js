const { createClient } = require("@supabase/supabase-js");
const db = require("../Models");
const Player = db.players;

const supabase = createClient(
  "https://lijmzdfdpsabhpwqlfnh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpam16ZGZkcHNhYmhwd3FsZm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MDQzNzcsImV4cCI6MjAxNzA4MDM3N30.YJPUGL7jXFlf6SG_mE_k4cR9aVtnlUFNGqfVjnVb8ZM"
);

const handler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from("players")
      .select()
      .eq("email", email);

    if (error) {
      return res.status(500).send(error.message);
    }

    const user = data ? data[0] : null;

    // Continue with your existing logic...

    return res.status(201).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { handler };
