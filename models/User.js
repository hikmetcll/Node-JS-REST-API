const db = require ('../database/db');
const Joi = require ('@hapi/joi');
const jwt= require ('jsonwebtoken');
var dateFormat = require('dateformat');


db.con.connect(function(err) {
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

exports.Users_Select = function(){
    return new Promise(function(resolve, reject){
		db.con.query('SELECT * FROM user WHERE deleteDate IS NULL ORDER BY id DESC', function(err, result){
      console.log(parseInt(result));
			if (!err) resolve(JSON.parse(JSON.stringify({result}))); // Hacky solution
			else reject(err);
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
      console.log(req.createDate);
		db.con.query('INSERT INTO user SET ?',req ,function (err, result){
        if (!err)
        {
          if(result.affectedRows>0)
          { 
            console.log('User Insert');
            resolve(JSON.parse(JSON.stringify({state:'Insert Success'})));
          }
          else
          {
            console.log('User Not Insert');
            resolve(JSON.parse(JSON.stringify({state:'Insert Unsuccess'})));
          }
        } 
        else 
        {
          reject(err);
        }
		});
  });
};

exports.Users_Update = function(req){   
    return new Promise(function(resolve, reject){
      req.updateDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
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
            console.log('id=', req.id, 'User Update');
            resolve(JSON.parse(JSON.stringify({state:'Update Success'})));
          }
          else
          {
            console.log('id=', req.id, 'User Not Update');
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
        console.log(req, param);
  		db.con.query('UPDATE user SET deleteDate=? WHERE id=? ', param, function(err, result){
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


exports.Users_Login= function(req){
  return new Promise(function(resolve, reject){
    var param=
    [
      req.email,
      req.password
    ]
        db.con.query('SELECT * FROM user WHERE email = ? and password = ?', param, function(err, result,field){
          if (!err)
      {
        if(result[0])
        {
          console.log('Access = ', req.name);
          const token = jwt.sign(
              {
                email:req.email,
                password:req.password
              },
              process.env.SECRET_KEY,
              {
                expiresIn:'1h'
              }
            );
          resolve(JSON.parse(JSON.stringify({token:token})));
        }
        else
        {
          console.log('Denied');
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
