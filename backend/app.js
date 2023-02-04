// Questo codice lo dedico a te, Camilla.
// Programmare è come scrivere una poesia.
// Questo è il mio modo di dire ti amo.


const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("isomorphic-fetch");
const random = require("randombytes");
//import connection from './dbconnect';
const tokenCheck = require("./middleware/tokencheck");
const chalk = require ('chalk');
const app = express();
const path = require('path');


//LOGGING

//we meed request id
const { v4: uuidv4 } = require('uuid');
app.use((req, res, next) => {
  req.id = uuidv4();
  next()
})

const morgan = require('morgan')

morgan.token('id', (req) => {
  return req.id.split('-')[0]
})

//log [DATETIME - #ID] METHOD URL STATUS RESPONSE-TIME ms - SIZE
// use colors
//app.use(morgan('[:date[iso] - #:id] :method :url :status :response-time ms - :res[content-length]'));
//same but with colors
app.use(morgan(chalk`[:date[iso] - {green #:id}] {blue :method} {yellow :url} {red :status} {green :response-time} ms - {blue :res[content-length]}`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connection = require('./dbconnect');

//timeout per testing
//app.use(function(req,res,next){setTimeout(next,1000)});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.options('*', function (req,res) { res.sendStatus(200); });

app.get("/miss/random", (req, res, next) => {
  //select id, nome, immagine, instagramURL from miss order by rand() limit 2;
  connection.query('SELECT id, nome, instagramURL FROM miss ORDER BY RAND() LIMIT 2', (err, rows, fields) => {
    if (err) throw err;
    //send rows
    res.status(200).json({
      message: "Miss random fetched successfully!",
      rows: rows
    });
  });
});

app.get("/mister/random", (req, res, next) => {
  //select id, nome, immagine, instagramURL from miss order by rand() limit 2;
  connection.query('SELECT id, nome, instagramURL FROM mister ORDER BY RAND() LIMIT 2', (err, rows, fields) => {
    if (err) throw err;
    res.status(200).json({
      message: "Mister random fetched successfully!",
      rows: rows
    });
  });
});

app.post("/match", (req, res, next) => {
  var contender1 = req.body.contender1;
  var contender2 = req.body.contender2;
  var winner = req.body.winner;
  var type = req.body.type;
  console.log(contender1);
  console.log(contender2);
  console.log(winner);
  //insert into logs (first, second, winner, type) values
  connection.query('INSERT INTO logs (first, second, winner, type) VALUES (?, ?, ?, ?)', [contender1, contender2, winner, type], (err, rows, fields) => {
      if (err) throw err;
      //now we need to update the score of the winner in the table
      //if type is 1 then we are in miss, else we are in mister
      if (type == 1) {
          //update wins and totalPlay in miss
          connection.query('UPDATE miss SET wins = wins + 1, totalPlay = totalPlay + 1 WHERE id = ?', [winner], (err, rows, fields) => {
              if (err) throw err;
              //now we need to update the loser
              connection.query('UPDATE miss SET totalPlay = totalPlay + 1 WHERE id = ?', [contender1 == winner ? contender2 : contender1], (err, rows, fields) => {
                  if (err) throw err;
                  //update totalPlay in miss for the loser
                  res.status(200).json({
                      message: "Match inserted successfully!"
                  });
              });
          });
      }
      else {
          //update wins and totalPlay in mister
          connection.query('UPDATE mister SET wins = wins + 1, totalPlay = totalPlay + 1 WHERE id = ?', [winner], (err, rows, fields) => {
              if (err) throw err;
              //now we need to update the loser
              connection.query('UPDATE mister SET totalPlay = totalPlay + 1 WHERE id = ?', [contender1 == winner ? contender2 : contender1], (err, rows, fields) => {
                  if (err) throw err;
                  //update totalPlay in mister for the loser
                  res.status(200).json({
                      message: "Match inserted successfully!"
                  });
              });
          });
      }
  });
});

app.get("/totalPlay", (req, res, next) => {
  //the records in logs are the total play
  connection.query('SELECT COUNT(*) AS totalPlay FROM logs', (err, rows, fields) => {
    if (err) throw err;
    res.status(200).json({
      message: "Total play fetched successfully!",
      rows: rows
    });
  });
});




module.exports = app;
