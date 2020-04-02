const db = require ('../database/db');
const Joi = require ('@hapi/joi');
const jwt= require ('jsonwebtoken');
var dateFormat = require('dateformat');
const logger = require('../log/logger');
const bcrypt = require("bcrypt")


/*db.con.connect(function(err) {
    if(err) 
    {
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000);
    }
    else
    {
      console.log('connection success');
    }
  });
*/

exports.Users_Select = function(){
    return new Promise(function(resolve, reject){
		db.con.query('SELECT * FROM user WHERE deleteDate IS NULL ORDER BY id DESC', function(err, result){
      db.con.query('SELECT COUNT(*) as total FROM user WHERE deleteDate IS NULL', function(error, count){
        if (!err)
        {
          logger.log('User/Listed/Success');
           resolve(JSON.parse(JSON.stringify({data:result, count:count[0].total}))); // Hacky solution
        }
        else 
        {
          logger.log('User/Listed/Unsuccess');
          reject(err);
        }
      });
		});
    /*db.con.query('SELECT * FROM user', function(error, rs){
        var result = JSON.stringify(rs);
        console.log('model calisti',error ,result);
        return result;*/
  })
}
exports.Users_Insert = function(req){
    return new Promise(function(resolve, reject){
      req.createDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      req.password=bcrypt.hashSync(req.password, bcrypt.genSaltSync(10));
    	db.con.query('SELECT COUNT(*) as total FROM user WHERE email=? and deleteDate IS NULL',req.email, function(err, count){
        if(count[0].total>0)
        {
          resolve(JSON.parse(JSON.stringify({state:'Insert Unsuccess', message:'Please enter a different email address'})));
        }
        else
        {
          db.con.query('INSERT INTO user SET ?',req ,function (err, result){
            if (!err)
            {
              if(result.affectedRows>0)
              { 
                logger.log('User/Insert/Success');
                resolve(JSON.parse(JSON.stringify({state:'Insert Success'})));
              }
              else
              {
                logger.log('User/Insert/Unsuccess');
                resolve(JSON.parse(JSON.stringify({state:'Insert Unsuccess'})));
              }
            } 
            else 
            {
              reject(err);
            }
        });
        }
      });
    });
};

exports.Users_Update = function(req){   
    return new Promise(function(resolve, reject){
      req.updateDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      if(req.password!=null)
      {
        req.password=bcrypt.hashSync(req.password, bcrypt.genSaltSync(10));
      }
        var param=
        [
            req,
            req.id
        ]
  		db.con.query('UPDATE user SET ? WHERE id=? ', param, function(err, result){
        if (!err)
        {
          if(result.affectedRows>0)
          {
            logger .log('User/Update/Success/id='+req.id);
            resolve(JSON.parse(JSON.stringify({state:'Update Success'})));
          }
          else
          {
            logger .log('User/Update/Unsuccess/id='+req.id);
            resolve(JSON.parse(JSON.stringify({state:'Update Unsuccess'})));
          }
        } 
        else 
        {
          reject(err);
        }
		});
	});
};

/*exports.Users_Delete = function(req){   
    return new Promise(function(resolve, reject){
      db.con.query('DELETE FROM user WHERE id = ?', req.id, function(err, result){
        if (!err)
        {
          if(result.affectedRows>0)
          {
            console.log('id=', req.id, 'User Delete');
            resolve(JSON.parse(JSON.stringify({state:'Delete Success'})));
          }
          else
          {
            console.log('id=', req.id, 'User Not Delete');
            resolve(JSON.parse(JSON.stringify({state:'Delete Unsuccess'})));
          }
        } 
        else 
        {
          reject(err);
        }
		});
  });
};
*/

exports.Users_Delete = function(req){   
  return new Promise(function(resolve, reject){
    req.deleteDate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    var param=
        [
            req.deleteDate,
            req.id
        ]
  		db.con.query('UPDATE user SET deleteDate=? WHERE id=? ', param, function(err, result){
      if (!err)
      {
        if(result.affectedRows>0)
        {
          logger.log('User/Delete/Success/id='+req.id);
          resolve(JSON.parse(JSON.stringify({state:'Delete Success'})));
        }
        else
        {
          logger.log('User/Delete/Unsuccess/id='+req.id);
          resolve(JSON.parse(JSON.stringify({state:'Delete Unsuccess'})));
        }
      } 
      else 
      {
        reject(err);
      }
  });
});
};


exports.Users_Login= function(req){
  return new Promise(function(resolve, reject){
        db.con.query('SELECT * FROM user WHERE email = ? AND deleteDate IS NULL', req.email, function(err, result,field){
        if (!err)
        {
          if(bcrypt.compareSync(req.password, result[0].password))
          {
            if(result[0])
            {
              logger.log('User/Login/Success/name='+req.email);
              const token = jwt.sign(
                  {
                    email:req.email,
                    password:req.password
                  },
                  process.env.SECRET_KEY,
                  {
                    expiresIn:'12h'
                  }
                );
              resolve(JSON.parse(JSON.stringify({token:token})));
            }
            else
            {
              logger.log('User/Login/Unsuccess');
              resolve(JSON.parse(JSON.stringify({state:'Denied'})));
            }
          } 
          else
          {
            logger.log('User/Login/Unsuccess');
            resolve(JSON.parse(JSON.stringify({state:'Denied'})));
          }
        }
        else 
        {
          reject(err);
        }
  });
});
};
