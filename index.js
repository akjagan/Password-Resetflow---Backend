import express from "express";
import "dotenv/config"; // '.js' நீக்கப்பட்டுள்ளது
import Routes from "./src/routes/index.js";
import cors from "cors";

const PORT = process.env.PORT || 3001; // Default value added
const app = express();

app.use(cors());
app.use(express.json());
app.use(Routes);

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`); // Base URL
});

// import express from "express";
// import "dotenv/config.js";
// import Routes from "./src/routes/index.js";
// import cors from "cors";

// const PORT = process.env.PORT;
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(Routes);

// app.listen(PORT, () => {
//   console.log(`Server started at PORT: ${PORT}`);
//   console.log(`Visit http://localhost:${PORT}`); // Base URL
// });
