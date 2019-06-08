import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

import {  
  getTopDoctors,
  getDoctorById,
  getDoctorByQuery
} from "./betterDocApi";


$(() => {
  viewMainMenu();
  handleUi();
});


function viewMainMenu() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      viewTopDoctors(position.coords.latitude, position.coords.longitude);
    }, () => {
      viewTopDoctors('45.515', '-122.679',
        `<h4 class="text-center m-auto">Location data blocked by browser<br><small>Allow to see nearby doctors with a high rating<small></h4>`);
    });
  } else {
    viewTopDoctors('45.515', '-122.679',
      `<h4 class="text-center m-auto">Location data not available on your browser</h4>`);
  }
}

function viewTopDoctors(lat, lon, prepend) {
  getTopDoctors(lat, lon).then((doctors) => {
    buildFrontCards(doctors);
    $('#front').prepend(prepend);
    $('.docCard').click(function () {
      viewDoctor(this.id);
    });
  }, (error) => {
    $('#front').html(`<h4 class="text-center m-auto">Could not access BetterDoctor database<br><small>${error}<small></h4>`);
  });
}


function handleUi() {
  $('#search-form').submit((event) => {
    event.preventDefault();
    getDoctorByQuery('45.515', '-122.679', $('#search-value').val()).then((doctors) => {
      buildFrontCards(doctors);
      $('.docCard').click(function () {
        viewDoctor(this.id);
      });      
      if (doctors.data.length !== 0) {
        $('#front').prepend(`<h4 class="text-center m-auto">Search results for: <small>${$('#search-value').val()}</small></h4>`);
      } else {
        $('#front').prepend(`<h4 class="text-center m-auto">No search results for: <small>${$('#search-value').val()}</small></h4>`);
      }
      
      
      $('#search-value').val("");
    }, (error) => {
      $('#front').html(`<h4 class="text-center m-auto">Could not access BetterDoctor database<br><small>${error}<small></h4>`);
    });
  });
}


function viewDoctor(id) {
  $('#front').html(`<div class="loader"></div>`);
  getDoctorById(id).then((doc) => {
    buildDocView(doc.data);
  }, (error) => {
    $('#front').html(`<h4 class="text-center m-auto">Could not access BetterDoctor database<br><small>${error}<small></h4>`);
  });
}

function buildDocView(doctor) {  
  let offices = "";
  let specialties = "";
  doctor.specialties.forEach((specialty) => {
    if (specialty.actor != undefined) {
      specialties += `<p>${specialty.actor}</p>`;
    }
  });

  doctor.practices.forEach((practice) => {
    if (practice != undefined) {
      offices +=
        `
<h4>${practice.name}</h4>
<p>${practice.visit_address.street}</p>
<p>${practice.visit_address.city} ${practice.visit_address.state} ${practice.visit_address.zip}</p>
<p>${practice.phones[0].number} (${practice.phones[0].type})</p>
<p class="border-bottom ${practice.accepts_new_patients === true ? 'text-success' : 'text-danger'}">Currently ${practice.accepts_new_patients === true ? 'accepting new patients' : 'not accepting patients'}</p>
`;
    }
  });

  let view =
    `
<div class="jumbotron p-3 p-md-5 text-white rounded bg-dark">
    <div class="col-md-6 px-0">
        <h1 class="display-4 font-italic">${doctor.profile.first_name} ${doctor.profile.last_name}</h1>
        <p class="lead my-3">${doctor.profile.title === undefined ? "" : ` ${doctor.profile.title}`}</p>
    </div>
</div>
<div class="row">            
    <div class="col-md-8 info-main">                        
        <h3 class="pb-3 mb-4 font-italic border-bottom">
            Specialties
        </h3>
        ${specialties}
    </div>
    <aside class="col-md-4 info-sidebar">
        <div class="p-3 mb-3 bg-light rounded">
           ${offices}

        </div>
    </aside>
</div>
`;
  $('#front').html(view);
}


function buildFrontCards(doctors) {
  let cards = `<div class="row">`;

  doctors.data.forEach((doc) => {
    let specialties = "";
    doc.specialties.forEach((specialty) => {
      if (specialty.actor != undefined) {
        specialties += `<div class="card-text">${specialty.actor}</div>`;
      }
    });    
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
  cards += `</div>`;
  $('#front').html(cards);
}