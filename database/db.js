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
