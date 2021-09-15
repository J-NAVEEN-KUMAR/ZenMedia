let posts = document.querySelector('#posts');
let body = document.querySelector('body');

const apiurl = 'https://60f814a29cdca000174551e9.mockapi.io/posts/';
getdata();

async function getdata() {
  try {
    let resp = await fetch(apiurl);
    let data = await resp.json();
    createpost(data);
  } catch (error) {
    console.log(error);
  }
}

function createpost(data) {
  posts.innerHTML = "";
  data.forEach(element => {
    id = element.id;
    title = element.title;
    query = element.query;
    username = element.username;
    password = element.password;
    posts.innerHTML += `
      <div class="card border-success mb-3 col-4 m-2" style="max-width: 18rem;min-width:10rem; background-color:#001219"   id="individual_post_${id}">
        <div class="card-body text-light">
          <p class="card-text">
            ${title}
          </p><br>
          Created by <span style="color:green">${username}</span>
        </div>
      </div>
  `;
  });
  openquery(data);
}

async function postdata() {
  let username = document.querySelector('#name');
  let password = document.querySelector('#password');
  let title = document.querySelector('#title');
  let query = document.querySelector('#query');
  try {
    username = username.value;
    password = password.value;
    title = title.value;
    query = query.value;
    console.log(username,password,title,query);
    const regexn = /^\d{8,15}$/;
    let p_valid = regexn.test(password);
    console.log(p_valid);
    
    if(username == "" || password == "" || title == "" || query == "" || !p_valid){
      alert("Please fill all the fields and password must contain only digits (range 8-15)!");
    }
    else {
      let resp = await fetch(apiurl,{
        method:"POST",
        body:JSON.stringify({username,password,title,query}),
        headers:{
          "Content-Type" : "application/json",
        }
      });
      getdata();
    }
  } catch (error) {
    console.log(error);
  }
}

function openquery(data) {
  console.log(data);
  data.forEach(element => {
  document.querySelector(`#individual_post_${element.id}`).addEventListener('click', ()=> {
    console.log(element.id,element.title,element.query,element.username);
    console.log(typeof(password));
    body.innerHTML = `
  <div class="modal fade" id="addcomment" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog text-light">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Add comment</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" class="text-light">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="commentby" class="col-form-label">By</label>
              <input type="text" class="form-control" id="commentby" placeholder="Enter name">
            </div>
            <div class="form-group">
              <label for="yourcomment" class="col-form-label">Comment</label>
              <textarea class="form-control" id="yourcomment" placeholder="Your comment"> </textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" onclick=addcomment(${element.id}) data-dismiss="modal" aria-label="Close">Post</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="deletepost" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog text-light">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Are you sure, want to delete this post?</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" class="text-light">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="postpassword" class="col-form-label">Password</label>
              <input type="password" class="form-control" id="postpassword" placeholder="Enter your password">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" onclick=deletepost(${element.id},${element.password})  data-dismiss="modal" aria-label="Close">Delete</button>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div style="text-align:center" class="m-2">
      <a href="" data-target="#home"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i></a>
      <h3 class="display-5" style="display:inline;">${element.title}</h3>
      <p>Created by <span style="color:white">${element.username}</span></p>
      <p>${element.query}</p>
    </div>
    
    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#addcomment">Add comment</button>
    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deletepost">Delete Post</button>
    <div class="card comments mt-2" style="background-color:#001219">
      <h3 class="display-5 text-success mt-2">Comments</h3>
      <div class="card mb-3 col-12 m-2" style="background-color:#001219" id=comments_body>
        ${comments(element.id)}
      </div>
    </div>
  </div>
  `
});
})
}

async function addcomment(id) {
  console.log(apiurl + id + "/" + "users");
  let name = document.querySelector('#commentby').value;
  let comment = document.querySelector('#yourcomment').value;
  if(name == "" || comment == "") {
    alert("Please fill all the fields!");
  }
  else {
    try {
      let resp = await fetch(apiurl + id + "/" + "users", {
        method:"POST",
        body:JSON.stringify({name,comment}),
        headers:{
          "Content-Type" : "application/json",
        }
      });
      comments(id);
    } catch (error) {
      console.log(error);
    }
  }
    
  
}

async function comments(id) {
  try {
    let resp_users = await fetch(apiurl+id+"/"+"users");
    let data_users = await resp_users.json();
    console.log(data_users);
    let comments_body = document.querySelector('#comments_body');
    comments_body.innerHTML = "";
    data_users.forEach(element =>  {
      comments_body.innerHTML += `
      <div class="card text-success border-success m-2" style="background-color:#001219">
        <p class="card-text m-2" id=commentbox style="color:white">${element.comment}</p>
        <p class="card-text m-2" id=commentor>--<span style="color:green"> ${element.name}</span></p>
      </div>
      `
    });
  } catch (error) {
    console.log(error);
  }
  
}


async function deletepost(id,password) {
  try {
    password = password.toString();
    console.log(typeof(password));
    let entered_password = document.querySelector('#postpassword').value;
    entered_password = entered_password.toString();
    console.log(typeof(entered_password));
    if(entered_password == "") {
      alert("Please enter password!");
    }
    else {
      console.log(entered_password);
      if(password == entered_password) {
        let resp_comments = await fetch(apiurl + id + "/" + "users" + "/" + id, {
          method:"DELETE",
        });
        let resp = await fetch(apiurl + id, {
          method:"DELETE",
        });
        console.log(apiurl+id);
        let data = await resp.json();
        console.log(data);
        alert("Deleting...");
        window.location.reload();
      }
      else {
        alert("Incorrect password!");
      }
    }
  } catch (error) {
    console.log(error);
  }

}


let password_toggle = document.getElementsByClassName("toggle-password");
console.log(password_toggle);
let password_field = document.getElementById("password");
password_toggle[0].addEventListener('click', function() {
  password_toggle[0].classList.toggle('active');
  if(password_field.getAttribute("type") == "password") {
    password_field.setAttribute("type","text");
  }else {
    password_field.setAttribute("type","password");
  }
})
