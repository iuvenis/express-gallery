var deleteButton = document.querySelector('#deleteButton');
var editButton = document.querySelector('#editButton');

deleteButton.addEventListener('click', deleteButtonClick);
editButton.addEventListener('click',editButtonClick);

function deleteButtonClick(evt) {
  evt.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', deletePhoto);
  xhr.open('DELETE', this.href);
  xhr.send();
}

function editButtonClick(evt) {
  evt.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', deletePhoto);
  xhr.open('PUT', this.href);
  xhr.send();
}


function deletePhoto(evt) {
  var response = JSON.parse(this.responseText);
  if(response.success === true) {
    window.location.href = response.redirect;
  }
}

function editPhoto(evt) {
  var response = JSON.parse(this.responseText);
  if(response.success === true) {
    window.location.href = response.redirect;
  }
}