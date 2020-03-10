const UsersModel = require ('../models/User');
var express = require('express');

process.env.SECRET_KEY = 'secret'



exports.List = function(req, res, next) {
    UsersModel.Users_Select()
    .then(result=>{res.send(result); })
    .catch(err => {
        res.send('error: ' + err)
      })
  }

exports.Insert = function(req, res, next) {
    UsersModel.Users_Insert(req.body)
    .then(result=>{res.send(result); })
    .catch(err => {
        res.send('error: ' + err)
      })
 }


 exports.Update = function(req, res, next) {
    UsersModel.Users_Update(req.body)
    .then(result=>{res.send(result); })
    .catch(err => {
        res.send('error: ' + err)
      })
 }

 exports.Delete = function(req, res, next) {
  UsersModel.Users_Delete(req.body)
  .then(result=>{res.send(result); })
  .catch(err => {
      res.send('error: ' + err)
    })
}
exports.Login = function(req, res, next) {
  UsersModel.Users_Login(req.body)
  .then(result=>{res.send(result); })
  .catch(err => {
      res.send('error: ' + err)
    })
}