const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://lijmzdfdpsabhpwqlfnh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpam16ZGZkcHNhYmhwd3FsZm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MDQzNzcsImV4cCI6MjAxNzA4MDM3N30.YJPUGL7jXFlf6SG_mE_k4cR9aVtnlUFNGqfVjnVb8ZM"
);
const HEADERS = {
  "content-type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        body: "",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST",
          "Access-Control-Allow-Headers": "Content-Type",
          // "Access-Control-Max-Age": "86400",
        },
      };
    }
    const { email, password } = JSON.parse(event.body);

    const { data, error } = await supabase
      .from("players")
      .select()
      .eq("email", email);
    console.log("DATA: ", data);
    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
        headers: HEADERS,
      };
    }

    const user = data ? data[0] : null;

    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      //if password is the same
      //generate token with the user's id and the secretKey in the env file

      if (isSame) {
        let token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        //if password matches with the one in the database
        //go ahead and generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log("LOGIN SUCCESSFULLY!!!");
        //send user data

        return {
          statusCode: 200,
          body: JSON.stringify(user),
          headers: HEADERS,
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify("Wrong password"),
          headers: HEADERS,
        };
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify("Account does not exists"),
        headers: HEADERS,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: HEADERS,
    };
  }
};

module.exports = { handler };
