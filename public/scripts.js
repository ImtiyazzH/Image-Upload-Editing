//Toggle of icon on profile section
function toggleDropdown() {
  var dropdown = document.getElementById("myDropdown");
  dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display === 'block') {
        openDropdown.style.display = 'none';
      }
    }
  }
}

//fetching details of profile name and picture
let userCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let userInfo = JSON.parse(sessionStorage.getItem("user-info"));

let fname = document.getElementById("fname")
let lname = document.getElementById("lname")
let signIn = document.getElementById("signIn")
let logOut = document.getElementById("logOut")

let Signout = () => {
  sessionStorage.removeItem("user-creds");
  sessionStorage.removeItem("user-info");
  window.location.href = 'login.html';
}

let CheckCred = () => {
  if (!sessionStorage.getItem("user-creds")) {
    logOut.style.display = 'none';
  }
  else {
    fname.innerText = userInfo.firstname;
    lname.innerText = userInfo.lastname;
  }
}

window.addEventListener("load", CheckCred);
logOut.addEventListener("click", Signout);





let cropper;

document.getElementById('imageInput').addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
  const fileInput = event.target;

  if (fileInput.files && fileInput.files[0]) {
    openCropModal(fileInput.files[0]);
  }
}

function openCropModal(imageFile) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const cropperImage = document.getElementById('cropperImage');
    cropperImage.src = e.target.result;

    $('#cropModal').modal('show');

    if (cropper) {
      cropper.replace(e.target.result);
    } else {
      cropper = new Cropper(cropperImage, {
        aspectRatio: 1,
        viewMode: 2,
      });
    }
  };

  reader.readAsDataURL(imageFile);
}

function cropImage() {
  if (cropper) {
    cropper.getCroppedCanvas().toBlob((blob) => {
      const formData = new FormData();
      formData.append('image', blob);

      fetch('/upload', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.text())
        .then(message => {
          console.log(message);
          alert('File uploaded and cropped successfully!');
          // Reload the image gallery after successful upload
          loadGallery();
        })
        .catch(error => console.error('Error uploading and cropping image:', error));

      // Close the modal after cropping
      $('#cropModal').modal('hide');
    });
  }
}

async function loadGallery() {
  try {
    const response = await fetch('/images');
    const images = await response.json();

    const imageGallery = document.getElementById('imageGallery');
    imageGallery.innerHTML = '';

    images.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = image.path;
      imgElement.alt = image.filename;

      const divElement = document.createElement('div');
      divElement.classList.add('col-12', 'col-md-4', 'gallery-image');
      divElement.appendChild(imgElement);

      imageGallery.appendChild(divElement);
    });
  } catch (error) {
    console.error('Error loading gallery:', error);
  }
}

// Initial load of the gallery
loadGallery();
