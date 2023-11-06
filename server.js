/*********************************************************************************
* BTI325 – Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* 
        Name: Cris Huynh 
        Student ID: 105444228 
<<<<<<< HEAD
        Date: Nov 3rd, 2023
=======
        Date: Oct 1st, 2023
>>>>>>> 6e4063c669b4a0fc07a9ad7344de86f8aad116af
        URL: https://beautiful-blue-armadillo.cyclic.app
*
********************************************************************************/
const legoData = require("./modules/legoSets");
const path = require("path");

const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static("public")); // CSS
app.use(express.static(path.join(__dirname, "public")));
// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "./views"); // Specify the views directory

// Route for the home page
app.get("/", (request, response) => {
  response.render("home");
});

// Route for returning all Lego sets
app.get("/lego/sets/", (request, response) => {
  const theme = request.query.theme;
  //If there is a theme parameter, filter sets by theme
  if (theme) {
    legoData.initialize().then(() => {
      legoData
        .getSetsByTheme(theme)
        .then((sets) => {
          response.render("sets", { sets: sets });
        })
        .catch((error) => {
          response.status(404).render("404", { message: "No Sets found for a matching theme" });
        });
    });
  } else {
    //If no theme parameter, retrun all unfiltered Lego data
    legoData.initialize().then(() => {
      legoData.getAllSets().then((sets) => {
        response.render("sets", { sets: sets });
      });
    });
  }
});
//Route for the about page
app.get("/about", (request, response) => {
  response.render("about");
});

// Route for returning a specific Lego set by set number
app.get("/lego/sets/:set_num", (request, response) => {
  legoData
    .initialize()
    .then(() => legoData.getSetByNum(request.params.set_num))
    .then((set) => {
      if (set) {
        response.render("set", { set: set });
      } else {
        response.status(404).render("404", { message: "The requested Lego set was not found" });
      }
    })
    .catch((message) => {
      response.status(404).render("404", { message: "The requested Lego set was not found" });
    });
});

// Custom 404 route
app.use((request, response) => {
  const path = request.originalUrl;
  let errorMessage = "The requested Lego set was not found";

  if (path.includes("/lego/sets?theme=")) {
    errorMessage = "No sets found for the specified theme.";
    response.status(404).render("404", { message: errorMessage });
  } else if (path.includes("/lego/sets/")) {
    errorMessage = "No set found for the specified set number.";
    response.status(404).render("404", { message: errorMessage });
  } else {
    errorMessage = "No view matched for the specific route.";
    response.status(404).render("404", { message: errorMessage });
  }
});

app.listen(HTTP_PORT, () => {
  console.log(`sever listening on ${HTTP_PORT}`);
});
