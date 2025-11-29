const express = require("express");
const cors = require("cors");
const Router = require("./routes/index")

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1" , Router );

app.get('/', (req, res) => {
    res.status(200).send({
        status: "API is running",
        version: "v1"
    });
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(3000);