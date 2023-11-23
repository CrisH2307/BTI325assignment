/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* 
        Name: Cris Huynh 
        Student ID: 105444228 
        Date: Nov 10th, 2023
        URL: https://beautiful-blue-armadillo.cyclic.app
*
********************************************************************************/

require("dotenv").config();

//* ----------------------------------- POSTGRE SQL INITIALIZATION ---------------------------------------------------//

const Sequelize = require("sequelize");

// set up sequelize to point to our postgres database
let sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.log("Unable to connect to the database:", err);
//   });

// synchronize the Database with our models and automatically add the
// table if it does not exist

const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

const Set = sequelize.define("Set", {
  set_num: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  year: Sequelize.INTEGER,
  num_parts: Sequelize.INTEGER,
  theme_id: Sequelize.INTEGER,
  img_url: Sequelize.STRING,
});

Set.belongsTo(Theme, { foreignKey: "theme_id" });

//* ----------------------------------- SETS INITIALIZATION ---------------------------------------------------//
const initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to initialize. ");
      });
  });
};

const getAllSets = () => {
  return new Promise((resolve, reject) => {
    try {
      Set.findAll({
        include: [Theme],
      }).then((data) => {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getSetByNum = (setNum) => {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [Theme],
      where: {
        set_num: setNum,
      },
    })
      .then((setArray) => {
        if (setArray && setArray.length > 0) resolve(setArray[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getSetsByTheme = (theme) => {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [Theme],
      where: {
        "$Theme.name$": {
          [Sequelize.Op.iLike]: `%${theme}%`,
        },
      },
    })
      .then((setArray) => {
        if (setArray && setArray.length > 0) resolve(setArray);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const addSet = (setData) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.create(setData);
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
  });
};

const getAllThemes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let allThemes = await Theme.findAll();
      resolve(allThemes);
      return allThemes;
    } catch (err) {
      reject(err);
    }
  });
};

const editSet = (set_num, setData) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.update(setData, {
        where: {
          set_num: set_num,
        },
      });
      resolve();
    } catch (err) {
      reject(new Error(`${err}`));
    }
  });
};

const deleteSet = (set_num) => {
  return new Promise(async (resolve, request) => {
    try {
      await Set.destroy({
        where: {
          set_num: set_num,
        },
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

// initialize();
module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, getAllThemes, addSet, editSet, deleteSet };
