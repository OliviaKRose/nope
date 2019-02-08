"use strict";
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static("public"));
app.use(bodyParser.json());

var path = require("path");

var people = [{"username": "doctorwhocomposer", "forename": "Delia", "surname": "Derbyshire", "password": "tardis", "access_token": "concertina"}];
var posts = [{"username":"doctorwhocomposer", "post": "post1", "img": "img/delia.jpg", "caption": "At the BBC Radiophonics Workshop", "likes":"0"}, {"username":"doctorwhocomposer", "post": "post2", "img": "img/white-noise.jpg", "caption": "Electric Storm by White Noise", "likes":"0"}, {"username":"doctorwhocomposer", "post": "post3", "img": "img/rsz_doctor-who.png", "caption": "Working on the Doctor Who theme tune", "likes":"0"}];
var profile = [{"username":"doctorwhocomposer","profilePic": "img/delia-profile.jpg", "bio": "About Me"}];

//Test functions
app.get("/people", function(req,res){
  res.status(200).json(people);
});

app.get("/people/:username", function(req,res){
  for(var i in people){
    if(people[i].username == req.params.username){
      res.status(200).json(people[i]);
      break;
    }
  }
});

app.post("/people", function(req,res){
  var ans = req.body;
  //check if you have permission or not
  if(ans.access_token!= "concertina"){
    res.status(403).send("Not correct permissions for this request.");
    return;
  }
  //check if username is taken or not
  for(var i in people){
    if(ans.username == people[i].username){
      res.status(400).send("Please choose a different username.");
      return;
    }
  }
  people.push({username: ans.username, forename: ans.forename, surname: ans.surname, password: ans.password, access_token: ans.access_token});
  res.send("The request was successful");
});
//Test functions


//Path functions - "res.redirect("/login")
app.get("/login", function(req,res){
  res.sendFile(path.join(__dirname + "/public/login.html"))
})
app.get("/profile", function(req,res){
  res.sendFile(path.join(__dirname + "/public/profile.html"))
})

app.get("/discover", function(req,res){
  res.sendFile(path.join(__dirname + "/public/discover.html"))
})
//Path functions

//Immediatedly redirect to login page
app.get('/', function(req, resp){
    resp.redirect('/login');
});

//login
app.post("/login", function(req,resp){
  var ans = req.body;
  var exists = false;
  var login = false;
  for(var i in people){
    if(ans.username == people[i].username){
      exists = true;
      break
    }
  }
  if(exists == true){
    if(people[i].password == ans.password){
      login = true;
    }
  }
  if(login == true){
    resp.redirect(302,'/discover');
    return;
  } else {
    resp.send("Login details incorrect");
    return;
  }
});

//create new user
app.post("/create", function(req,resp){
  var ans = req.body;
  //check if username is taken or not
  for(var i in people){
    if(ans.username == people[i].username){
      resp.send("Please choose a different username.");
      return;
    }
  }
  people.push({username: ans.username, forename: ans.forename, surname: ans.surname, password: ans.password, access_token: "concertina"});
  resp.redirect(302,'/discover');
  return;
});

//like button
app.post("/like", function(req,resp){
  var ans = req.body;
  var user = req.body.username;
  var p = req.body.post;
  var l = req.body.likes;
  for(var i in posts){
    if(user == posts[i].username) {
      if(p == posts[i].post){
        posts[i].likes = l;
        resp.send(posts[i].likes);
        return;
      }
      break;
    }
  }
  resp.status(500,"Error");
});

//discover page: get all users
app.get("/discover/all", function(req,resp){
    resp.send(JSON.stringify(people));
});
//still discover page: get all users
app.get("/discover/all/info",function(req,resp){
  var user = req.query.user;
  for(var i in profile){
    if(profile[i].username == user){
      resp.send(profile[i].profilePic + ":" + profile[i].bio);
    }
    break;
  }
});

//discover page: click on profile
app.get("/user", function(req,resp){
  var u = req.query.user;
  for(var p in people){
    if(people[p].username == u){
      resp.send(people[p]);
      return;
    }
    break;
  }
});

//get all posts of user
app.get("/posts",function(req,resp){
  var user = req.query.user;
  var list = [];
  for(var p in posts){
    if(posts[p].username == user){
      var post = posts[p].post;
      var img = posts[p].img;
      var caption = posts[p].caption;
      var likes = posts[p].likes;
      list.push({post: posts[p].post, img: posts[p].img, caption: posts[p].caption, likes: posts[p].likes});
    }
  }
  resp.send(list);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FUCK UP LINE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//discover page: search for specific person
app.get("/search",function(req,resp){
  var username = req.query.username;
  for(var p in people){
    if(people[p].username == username){
      resp.send(people[p]);
      return;
    } else {
    resp.send("Sorry there is no profile with this username.");
    }
  }
});

app.post("/post", function(req,resp){

});

module.exports = app;
