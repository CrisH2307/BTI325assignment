/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* 
        Name: Cris Huynh 
        Student ID: 105444228 
<<<<<<< HEAD
        Date: Nov 11th, 2023
=======
>>>>>>> 4d68244f7cbcd96c3c288d1466239162b347066c
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

//const legoSets = require("./path/to/legoSets"); // Import the legoSets module

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

express.urlencoded({ extended: true });

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
    //If no theme parameter, return all unfiltered Lego data
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

// GET route for displaying the addSet view
app.get("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render("addSet", { themes });
  } catch (err) {
    res.status(500).render("500", { message: `Error: ${err.message}` });
  }
});

// POST route for processing the addSet form
app.post("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res
      .status(500)
      .render("500", { message: `I'm sorry, but we have encountered the following error: ${err.errors[0].message}` });
  }
});

// GET route for editing a specific set
app.get("/lego/editSet/:set_num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.set_num);
    const themes = await legoData.getAllThemes();

    res.render("editSet", { themes, set });
  } catch (err) {
    res.status(404).render("404", { message: err.message });
  }
});

// POST route for updating a set
app.post("/lego/editSet", async (req, res) => {
  try {
    await legoData.editSet(req.body.set_num, req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err.errors[0].message || err}`,
    });
  }
});

// GET route for deleting a set
app.get("/lego/deleteSet/:set_num", async (req, res) => {
  try {
    await legoData.deleteSet(req.params.set_num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err.errors[0].message || err}`,
    });
  }
});

// Custom 404 route
app.use((req, res) => res.status(404).render("404", { message: "Page not found" }));

app.listen(HTTP_PORT, () => {
  console.log(`sever listening on ${HTTP_PORT}`);
});
