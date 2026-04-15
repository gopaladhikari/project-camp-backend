import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./utils/connect-to-db.js";

const PORT = process.env["PORT"] || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });
