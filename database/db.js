const express =require('express')
const  router = express.Router()

const mysql= require('mysql')

exports.con =mysql.createConnection({
    host:"localhost",
    user:"root",
    port: "3308",
    password: "password",
    database: "restapi_example",
    debug: false
});

exports.userData = {
    id:null,
    name:null,
    surname:null,
    email:null,
    password:null,
    createDate:null,
    updateDate:null,
    deleteDate:null
  };
