/* jshint esversion: 6 */
let time_remaining = 0;
let selected_user = null;
let valid_image = /.*\.(png|svg|jpg|jpeg|bmp)$/i;

///////////////////////////////////////////////
// CALLBACK API. Called by the webkit greeeter
///////////////////////////////////////////////

// called when the greeter asks to show a login prompt for a user
function show_prompt(text) {
  let password_container = document.querySelector("#password_container");
  let password_entry = document.querySelector("#password_entry");

  if (!isVisible(password_container)) {
    let users = document.querySelectorAll(".user");
    let user_node = document.querySelector("#"+selected_user);
    let rect = user_node.getClientRects()[0];
    let parentRect = user_node.parentElement.getClientRects()[0];
    let center = parentRect.width/2;
    let left = center - rect.width/2 - rect.left;
    let i = 0;
    if (left < 5 && left > -5) {
      left = 0;
    }
    for (i = 0; i < users.length; i++) {
      let node = users[i];
      setVisible(node, node.id === selected_user);
      node.style.left= left;
    }

    setVisible(password_container, true);
    password_entry.placeholder= text.replace(":", "");
  }
  password_entry.value= "";
  password_entry.focus();
}

// called when the greeter asks to show a message
function show_message(text) {
  let message = document.querySelector("#message_content");
  message.innerHTML= text;
  if (text) {
    document.querySelector("#message").classList.remove("hidden");
  } else {
    document.querySelector("#message").classList.add("hidden");
  }
  message.classList.remove("error");
}

// called when the greeter asks to show an error
function show_error(text) {
  show_message(text);
  let message = document.querySelector("#message_content");
  message.classList.add("error");
}

// called when the greeter is finished the authentication request
function authentication_complete() {
  let container = document.querySelector("#session_container");
  let children = container.querySelectorAll("input");
  let i = 0;
  let key = "";
  for (i = 0; i < children.length; i++) {
    let child = children[i];
    if (child.checked) {
      key = child.value;
      break;
    }
  }

  if (lightdm.is_authenticated) {
    if (key === "") {
      lightdm.login(lightdm.authentication_user, lightdm.default_session);
    } else {
      lightdm.login(lightdm.authentication_user, key);
    }
  } else {
    show_error("Authentication Failed");
    start_authentication(selected_user);
  }
}

// called when the greeter wants us to perform a timed login
function timed_login(user) {
  lightdm.login (lightdm.timed_login_user);
  //setTimeout('throbber()', 1000);
}

//////////////////////////////
// Implementation
//////////////////////////////
function start_authentication(username) {
  lightdm.cancel_timed_login();
  selected_user = username;
	let userObj = lightdm.users.filter((user) => (user.username)?user.username === username : user.name === username)[0];
	if(typeof(userObj) !== "undefined" && userObj.session) {
		Array.prototype.slice.call(document.querySelectorAll("input[type=radio][name=session]"), 0).forEach((radio) => {
			radio.checked = false;
			if(radio.value === userObj.session) radio.checked = true;
		});
	}
	else {
		Array.prototype.slice.call(document.querySelectorAll("input[type=radio][name=session]"), 0).forEach((radio) => {
			radio.checked = false;
			if(radio.value === lightdm.default_session.key) radio.checked = true;
		});
	}
	lightdm.start_authentication(username);
}

function provide_secret() {
  show_message("Logging in...");
  entry = document.querySelector('#password_entry');
  lightdm.respond(entry.value);
}

function initialize_sessions() {
  let template = document.querySelector("#session_template");
  let container = session_template.parentElement;
  let i = 0;
  container.removeChild(template);

  for (i = 0; i < lightdm.sessions.length; i = i + 1) {
    let session = lightdm.sessions[i];
    let s = template.cloneNode(true);
    s.id = "session_" + session.key;

    let label = s.querySelector(".session_label");
    let radio = s.querySelector("input");

    label.innerHTML = session.name;
    radio.value = session.key;
		radio.addEventListener("click", function() {
			if(document.getElementById("password_entry").value != "") document.querySelectorAll("form.password_prompt")[0].submit();
		});

		/*
    let default_session = 'default' == lightdm.default_session && 0 === i;
    if (session.key === lightdm.default_session || default_session) {
      radio.checked = true;
    }
		*/

    container.appendChild(s);
  }
}

function show_users() {
  let users = document.querySelectorAll(".user");
  let i = 0;
  for (i= 0; i < users.length; i++) {
    setVisible(users[i], true);
    users[i].style.left = 0;
  }
  setVisible(document.querySelector("#password_container"), false);
  selected_user = null;
}

function user_clicked(event) {
  if (selected_user !== null) {
    selected_user = null;
    lightdm.cancel_authentication();
    show_users();
  } else {
    selected_user = event.currentTarget.id;
    start_authentication(event.currentTarget.id);
  }
  show_message("");
  event.stopPropagation();
  return false;
}

function setVisible(element, visible) {
  if (visible) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}

function isVisible(element) {
  return !element.classList.contains("hidden");
}

function update_time() {
  let time = document.querySelector("#current_time");
  let date = new Date();

  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let suffix= "AM";
  if (hh > 12) {
    hh = hh - 12;
    suffix = "PM";
  }
  if (hh < 10) { hh = "0"+hh; }
  if (mm < 10) { mm = "0"+mm; }
  if (ss < 10) { ss = "0"+ss; }
  time.innerHTML = hh+":"+mm + " " + suffix;
}

//////////////////////////////////
// Initialization
//////////////////////////////////

function initialize() {
  show_message("");
  initialize_users();
  initialize_timer();
  initialize_sessions();
	/*
	let bg_image_dir = config.get_str("background_images");
	console.log("image_dir", bg_image_dir);
	if(bg_image_dir) {
		let backgrounds = greeter_util.dirlist(bg_image_dir);
		console.log("bg list", backgrounds);
		if(backgrounds.length) {
			let chosen = backgrounds[Math.floor(Math.random()*backgrounds.length)];
			document.querySelectorAll("body")[0].style.backgroundImage = chosen;
		}
	}
	*/
}

function on_image_error(e) {
  e.currentTarget.src = "img/avatar.svg";
}

function initialize_users() {
  let template = document.querySelector("#user_template");
  let parent = template.parentElement;
  parent.removeChild(template);

  for (i = 0; i < lightdm.users.length; i += 1) {
    user = lightdm.users[i];
    userNode = template.cloneNode(true);

    let image = userNode.querySelectorAll(".user_image")[0];
    let name = userNode.querySelectorAll(".user_name")[0];
    name.innerHTML = user.display_name;

    if (user.image) {
      image.src = user.image;
      image.onerror = on_image_error;
    } else {
      image.src = "img/avatar.svg";
    }

    userNode.id = user.name;
    userNode.onclick = user_clicked;
    parent.appendChild(userNode);
  }
  setTimeout(show_users, 400);
}

function initialize_timer() {
  update_time();
  setInterval(update_time, 1000);
}

function add_action(id, name, image, clickhandler, template, parent) {
  action_node = template.cloneNode(true);
  action_node.id = "action_" + id;
  img_node = action_node.querySelectorAll(".action_image")[0];
  label_node = action_node.querySelectorAll(".action_label")[0];
  label_node.innerHTML = name;
  img_node.src = image;
  action_node.onclick = clickhandler;
  parent.appendChild(action_node);
}
