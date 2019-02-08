$(document).ready(function(){
  //login
  $("#login").click(function(){
    var username = $("#username").val();
    var pass = $("#password").val();
    if (username != "" && pass != "" ) {
      $.post("http://localhost:8090/login", {username: username, password: pass, access_token:"concertina"},
      function(data){
        if(data == "Login details incorrect"){
          alert(data);
          $("#username").val("");
          $("#password").val("");
        }
        else {
          window.location.href = "discover";
        }
      });
    }});

//create new user
  $("#profile-creator").click(function(){
    var username = $("#newUser").val();
    var forename = $("#newFore").val();
    var surname = $("#newSur").val();
    var password = $("#newPass").val();
    if(username != "" && forename != "" && surname != "" && password != ""){
      $.post("http://localhost:8090/create", {username: username, forename: forename, surname: surname, password: password, access_token:"concertina"},
      function(data){
        if(data == "Please choose a different username."){
          alert(data);
          $("#newUser").val("");
          $("#newFore").val("");
          $("#newSur").val("");
          $("#newPass").val("");
          } else {
            window.location.href = "discover";
          }
        });
      } else {
        alert("Please ensure all fields are filled in");
      }
  });

//like button
  $(".like").click(function(){
    var color = $(this).children(".like-btn").css("color");
    var stringCount = $(this).siblings(".likes").html();
    var b = $(this).siblings(".likes").val();
    var count = parseInt(stringCount);
    //if grey -> red and increase like count
    if(color == "rgb(206, 198, 200)"){
      $(this).children(".like-btn").css("color","#FF0059");
      count ++;
    //if red -> grey and decrease like count
    } else if (color == "rgb(255, 0, 89)"){
      $(this).children(".like-btn").css("color","#CEC6C8");
      count --;
    } else {
      alert("Error");
    }
    $(this).siblings(".likes").html(count);
    var user = $(this).siblings("#username").html();
    var post = $(this).parent().parent().attr("id");
    $.post("http://localhost:8090/like", {username: user, post: post, likes: count}, function(data){
      console.log(data);
    })
  });

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FUCK UP LINE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //discover search
    $("#search").click(function(){
      var user = $("#searchText").val();
      console.log(user);
      $.get("http://localhost:8090/search", "username=" + user, function(data){
        $("#profile-box").html("");
        var userText = data.username;
        var forename = data.forename;
        var surname =  data.surname;
        var nameText = forename + " " + surname;
        $.get("http://localhost:8090/discover/all/info", "user=" + userText, function(data){
          var d = data.split(":");
          imgSrc = d[0];
          bioText = d[1];
          var card = $('<div class="col-sm-6 col-md-4 col-lg-3 bg-light card"></div>');
          var img = $('<img class="profile-pic card-img-top" src=' + imgSrc +  ' class="center">');
          var cardBody = $('<div class="card-body"></div>');
          var name = $('<h2 class="name card-title">'+nameText+'</h2>');
          var user = $('<p class="username card-text text-muted">'+userText+'</p>');
          var bio = $('<p class="bio">'+ bioText +'</p>');
          var btn = $('<a class="btn btn-outline-secondary edit profileLink" onclick="profileLinker(this)">View Profile</a>');
          cardBody.append(name);
          cardBody.append(user);
          cardBody.append(bio);
          cardBody.append(btn);
          card.append(img);
          card.append(cardBody);
          $("#profile-box").append(card);
        });
      });
    });

//create new post --- UNFINISHED
  $("#newPost").click(function(){
    var postBtn = $("#newPost").html();
    if (postBtn == "New Post"){
      $("#newPost").html("Post");
      $("#postForm").css("visibility","visible");
    } else if (postBtn == "Post") {
      //check if fields filled
      var l = 0;
      var post = Math.random();
      var user = "doctorwhocomposer";
      var caption = $("#newCaption").val();
      var img = $("#newImg").val();
      console.log(img);
      //NOT FINISHED
      $.post("http://localhost:8090/post",{username: user, post: post, img: img, caption: caption, likes: l},function(data){
        var card = $('<div id='+ post + ' class="col-md-4 card"></div>');
        var imgBod = $('<img class="card-img-top" src='+ imgSrc +'>');
        var cardBody = $('<div class="card-body"></div>');
        var username = $('<p id="username" class="card-title">'+ user +'</p>');
        var capt = $('<p class="card-text">'+ caption + '</p>');
        var butt = $('<a class="like btn"></a>');
        var buttIcon = $('<i class="like-btn fa fa-heart like"></i>');
        var likeButt = $('<a type="number" class="likes holder">'+ likes +'</a>');
        butt.append(buttIcon);
        cardbody.append(username);
        cardbody.append(capt);
        cardbody.append(butt);
        cardbody.append(likeButt);
        card.append(img);
        card.append(cardBody);
        $("#bigBoiBox").append(card);
      });
    }
  });

  function imageIsLoaded(e) {
      $('#profilePic').attr('src', e.target.result);

      //if ()
      //submit post request
      $("#newPost").html("New Post");
      $("#postForm").css("visibility","hidden");

  };

});

//change the padding on the login page
function loginPaddingChange() {
  if(document.getElementById("container").style.top != "3%") {
      (document.getElementById("container").style.top = "3%");
  }
  else {
      document.getElementById("container").style.top = "20%";
   }
 };

 //link discover -> profile
 function profileLinker(element){
 	var user =  $(element).siblings(".username").html();
 	console.log(user);
 	$.get("http://localhost:8090/user", "user=" + user, function(data){
 		var forename = data.forename;
 		var surname = data.surname;
  });
    //GET to get rest of profile and posts
  $.get("http://localhost:8090/discover/all/info", "user=" + user, function(data){
    var d = data.split(":");
    imgSrc = d[0];
    bioText = d[1];
  });
  $.get("http://localhost:8090/posts", "user=" + user, function(data){
    for(var i in data){
      var postID = data[i].post;
      var imgSrc = data[i].img;
      var caption = data[i].caption;
      var likes = data[i].likes;
      var card = $('<div id='+ post + ' class="col-md-4 card"></div>');
      var img = $('<img class="card-img-top" src='+ imgSrc +'>');
			var cardBody = $('<div class="card-body"></div>');
      var username = $('<p id="username" class="card-title">'+ user +'</p>');
			var capt = $('<p class="card-text">'+ caption + '</p>');
      var butt = $('<a class="like btn"></a>');
      var buttIcon = $('<i class="like-btn fa fa-heart like"></i>');
      var likeButt = $('<a type="number" class="likes holder">'+ likes +'</a>');
      butt.append(buttIcon);
      cardbody.append(username);
      cardbody.append(capt);
      cardbody.append(butt);
      cardbody.append(likeButt);
      card.append(img);
      card.append(cardBody);
      $("#bigBoiBox").append(card);
    }
  });
  window.location.href = "profile/";
 };

//load discover page
function displayFunction(){
  $.get("http://localhost:8090/discover/all", "people", function(data){
 	//split into profiles and then load each profile card and append card to parent discover
 	var list = [];
 	var people = [];
 	i = 0;
 	while(i <= data.length){
 		if(data[i] == "{" || data[i] == "}"){
 			list.push(i);
 		}
 		i ++;
 	}
 	var c = 0;
 	while(c <= (list.length-1)){
 		var a = list[c];
 		var b = list[c+1];
 		var sub = data.slice(a,b+1);
 		c = c + 2;
 		people.push(sub);
 	}
 	for(var i in people){
 		var info = people[i].split(":");
 		var userText = info[1].slice(1,-12);
 		var forename = info[2].slice(1,-11);
 		var surname =  info[3].slice(1,-12);
 		var nameText = forename + " " + surname;
 		$.get("http://localhost:8090/discover/all/info", "user=" + userText, function(data){
 			var d = data.split(":");
 			imgSrc = d[0];
 			bioText = d[1];
 			var card = $('<div class="col-sm-6 col-md-4 col-lg-3 bg-light card"></div>');
 			var img = $('<img class="profile-pic card-img-top" src=' + imgSrc +  ' class="center">');
 	  	var cardBody = $('<div class="card-body"></div>');
 	  	var name = $('<h2 class="name card-title">'+nameText+'</h2>');
 	  	var user = $('<p class="username card-text text-muted">'+userText+'</p>');
 	  	var bio = $('<p class="bio">'+ bioText +'</p>');
 	  	var btn = $('<a class="btn btn-outline-secondary edit profileLink" onclick="profileLinker(this)">View Profile</a>');
 			cardBody.append(name);
 			cardBody.append(user);
 			cardBody.append(bio);
 			cardBody.append(btn);
 			card.append(img);
 			card.append(cardBody);
 			$("#profile-box").append(card);
 		});
 	}
  });
};
