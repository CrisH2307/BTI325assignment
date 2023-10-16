/*********************************************************************************
* BTI325 – Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* 
        Name: Cris Huynh 
        Student ID: 105444228 
        Date: Oct 1st, 2023
        URL: https://beautiful-blue-armadillo.cyclic.app
*
********************************************************************************/
const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

const initialize = () => {
  return new Promise((resolve, reject) => {
    setData.forEach((setO) => {
      const sameThing = themeData.find((themeO) => themeO.id === setO.theme_id);

      if (sameThing) {
        const newSetObj = {
          ...setO,
          theme: sameThing.name,
        };

        sets.push(newSetObj);
      }
    });
    resolve();
  });
};

const getAllSets = () => {
  return new Promise((resolve, reject) => {
    resolve(sets);
  });
};

const getSetByNum = (setNum) => {
  return new Promise((resolve, reject) => {
    const found = sets.find((setObj) => setObj.set_num === setNum);

    if (!found) {
      reject("Unable to find requested");
    } else {
      resolve(found);
    }
  });
};

const getSetsByTheme = (theme) => {
  return new Promise((resolve, reject) => {
    const matchTheme = sets.filter((set) => set.theme.toLowerCase().includes(theme.toLowerCase()));

    if (matchTheme.length === 0) {
      reject("Unable to find");
    } else {
      resolve(matchTheme);
    }
  });
};

initialize();
console.log(getAllSets());
module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };


const legoData = require("./modules/legoSets");
const path = require("path");

const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static("public")); // CSS

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "./views"); // Specify the views directory

// Route for the home page
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "/views/home.html"));
});

// Route for returning all Lego sets
app.get("/lego/sets", (request, response) => {
  const theme = request.query.theme;

  //If there is a theme parameter, filter sets by theme
  if (theme) {
    legoData.initialize().then(() => {
      legoData.getSetsByTheme(theme).then((sets) => {
        response.send(sets);
      });
    });
  } else {
    //If no theme parameter, retrun all unfiltered Lego data
    legoData.initialize().then(() => {
      legoData.getAllSets().then((sets) => {
        response.sendFile(sets);
      });
    });
  }
});

//Route for the about page
app.get("/about", (request, response) => {
  response.sendFile(path.join(__dirname, "/views/about.html"));
});

// Route for returning a specific Lego set by set number
app.get("/lego/sets/:set_num", (request, response) => {
  legoData
    .initialize()
    .then(() => {
      legoData.getSetByNum(request.params.set_num).then((sets) => {
        response.send(sets);
      });
    })

    .catch((error) => {
      response.send(err);
    });
});

// Custom 404 route
app.use((request, response) => {
  response.status(404);
  response.sendFile(__dirname + "/views/404.html");
});

app.listen(HTTP_PORT, () => {
  console.log(`sever listening on ${HTTP_PORT}`);
});
