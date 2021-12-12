// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

const scoreJSON = './score.json';
let highScore = 0;

function getJSONFromFile(file, res) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        res.status(404).send(`${filePath} does nto exist!`);
        return;
    }
    fs.readFile(filePath, 'utf8', (err, jsonString) => {
        if (err) {
            console.error(err);
            res.status(404).send(err);
        };

        try {
            const json = JSON.parse(jsonString);
            res.json(json);
        } catch (error) {
            res.status(404).send(error);
        }
    });
}

function writeToJSONFile(file, data, res) {
    const jsonString = JSON.stringify(data);
    fs.writeFile(path.join(__dirname, file), jsonString, err => {
        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            res.status(200).send('File sucessfully saved');
        }
    });
}

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get('/api/score', (req, res) => {
  getJSONFromFile(scoreJSON, res);
});

app.post('/api/score', (req, res) => {
  writeToJSONFile(scoreJSON, req.body, res);       
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
