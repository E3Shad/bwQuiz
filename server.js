const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6007;
const path = require("path");
require("dotenv").config();
const dbo = require("./db/conn");

app.set('trust proxy', 1);

const QuizRoutes = require("./routes/quizRoutes");

// Middleware
// app.use(cors());

app.use(cors());


const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.use("/quizRoutes", QuizRoutes);

app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start the server
app.listen(port, async () => {
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
     
      });
    console.log(`Server is running on port: ${port}`);
});

