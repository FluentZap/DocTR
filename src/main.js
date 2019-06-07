//require('exports-loader?file!./bootstrap/js/dist/.js')
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

import { getConditions, getTopDoctors } from "./betterDocApi";
//$(document).ready(function() {

//});

// getConditions(5, 0).then((response) => {
//   console.log(response);
// });


$(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      getTopDoctors(position.coords.latitude, position.coords.longitude).then((doctors) => {
        buildFrontCards(doctors);
      });
    }, () => {
      $('#frontCards').html(`<h4 class="text-center m-auto">Location data blocked by browser<br><small>Allow to see nearby doctors with a high rating<small></h4>`);
    });
  } else {
    $('#frontCards').html(`<h4 class="text-center m-auto">Location data not available on your browser</h4>`);
  }
  handleUi();
});



function handleUi() {
  $('.docCards').click(function () {
    this.id

  });


}


function viewDoctor(id) {

}



function buildFrontCards(doctors) {  
  let cards = "";
  
  doctors.data.forEach((doc) => {
    let specialties = "" 
    doc.specialties.forEach((specialty) =>{
      if (specialty.actor != undefined) {
        specialties += `<div class="card-text">${specialty.actor}</div>`;
      }
    });
    //<p class="card-text">${doc.profile.title === undefined ? "" : doc.profile.title}</p>
cards +=
  `
<div class="card" style="width: 12rem;">
  <img class="card-img-top" src="${doc.profile.image_url}" alt="Card image cap">
  <div class="card-body d-flex">
    <h5 class="card-title">${doc.profile.first_name} ${doc.profile.last_name}<small>${doc.profile.title === undefined ? "" : ` (${doc.profile.title})`}</small></h5>    
    ${specialties}
    <button id="${doc.uid}" class="btn btn-outline-primary docCard">More Info</button>
  </div>
</div>
`;
  });  
  $('#frontCards').html(cards);
}