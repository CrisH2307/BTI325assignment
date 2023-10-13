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
