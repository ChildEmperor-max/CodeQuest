const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://lijmzdfdpsabhpwqlfnh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpam16ZGZkcHNhYmhwd3FsZm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MDQzNzcsImV4cCI6MjAxNzA4MDM3N30.YJPUGL7jXFlf6SG_mE_k4cR9aVtnlUFNGqfVjnVb8ZM"
);

const handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const { data, error } = await supabase
      .from("players")
      .select()
      .eq("email", email);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      };
    }

    const user = data ? data[0] : null;

    // Continue with your existing logic...

    return {
      statusCode: 201,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

module.exports = { handler };
