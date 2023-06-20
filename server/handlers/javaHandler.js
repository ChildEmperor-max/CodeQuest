import fs from "fs";
import { execSync } from "child_process";
import { join } from "path";

export function handleSubmittedJavaAnswer(req, res, pool) {
  const code = req.body.code;
  const questTitle = req.body.quest;

  // Define the file paths
  const javaFilePath = join("server/scripts", "script.java");
  const classFilePath = join("server/scripts", "script.class");

  // Write the Java code to a file
  fs.writeFile(javaFilePath, code, (err) => {
    if (err) {
      console.error("Error writing Java code to file:", err);
      res.status(500).json({ error: "Error writing Java code to file" });
      return;
    }

    // Compile the Java code
    try {
      execSync(`javac ${javaFilePath}`);
    } catch (error) {
      const compilationError = error.stderr.toString();
      console.error("Java code compilation error:", compilationError);
      res
        .status(500)
        .json({ error: "Java code compilation error", compilationError });
      return;
    }

    // Execute the Java code
    try {
      const output = execSync(`java -cp server/scripts script`).toString();
      res.json({ output: output });
    } catch (error) {
      const executionError = error.stderr.toString();
      console.error("Java code execution error:", executionError);
      res
        .status(500)
        .json({ error: "Java code execution error", executionError });
    } finally {
      // Clean up - remove the generated class file
      fs.unlink(classFilePath, (err) => {
        if (err) {
          console.error("Error removing class file:", err);
        }
      });
    }
  });
}
