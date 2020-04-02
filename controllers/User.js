const UsersModel = require ('../models/User');
var express = require('express');
const logger = require('../log/logger');
const db = require ('../database/db');


exports.List = function(req, res, next) {
    UsersModel.Users_Select()
    .then(result=>{res.send(result); })
    .catch(err => {
        res.send('error: ' + err)
      })
  }

exports.Insert = function(req, res, next) {
  db.userData=req.body;
    UsersModel.Users_Insert(db.userData)
    .then(result=>{res.send(result); })
    .catch(err => {
        res.send('error: ' + err)
      })
 }



 exports.Update = function(req, res, next) {
  db.userData=req.body;
    UsersModel.Users_Update(db.userData)
    .then(result=>{res.send(result); })
    .catch(err => {
        res.send('error: ' + err)
      })
 }

 exports.Delete = function(req, res, next) {
  db.userData=req.body;
  UsersModel.Users_Delete(db.userData)
  .then(result=>{res.send(result); })
  .catch(err => {
      res.send('error: ' + err)
    })
}
exports.Login = function(req, res, next) {
  db.userData=req.body;
  UsersModel.Users_Login(db.userData)
  .then(result=>{res.send(result); })
  .catch(err => {
      res.send('error: ' + err)
    })
}

exports.LogSettings = function(req, res, next) {
  try{
    if(req.body.logStatus!=null && (req.body.logStatus=="true" || req.body.logStatus=="false"))
    {
      logger.log('Log/Statuschanged/'+req.body.logStatus);
      process.env.LOG_STATUS = req.body.logStatus;
    }
    if(req.body.saveLogStatus!=null && (req.body.saveLogStatus=="true" || req.body.saveLogStatus=="false"))
    {
      logger.log('Log/SaveStatus/'+req.body.saveLogStatus);
      process.env.SAVE_LOG_STATUS = req.body.saveLogStatus;
    }
    else
    {
      logger.log('Empty or wrong data');
      return res.status(401).json({
        message:'Empty or wrong data'
    });
    }
    res.json({'changeStatus':'succes'});
  }
  catch
  {
    res.json({'error': 'Not Changed Log Status'});
  }
  
}