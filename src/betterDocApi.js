export function getDoctorById(id) {
  let args = {
    url: `https://api.betterdoctor.com/2016-03-01/doctors/${id}/`,
    parameters: {      
      //fields: 'profile,specialties',
      user_key: process.env.exports.apiKey
    }
  };
  return getDoctorAPI(buildURL(args));
}





//Get Top Doctors By Location
export function getTopDoctors(lat, lon) {
  let args = {
    url: `https://api.betterdoctor.com/2016-03-01/doctors/`,
    parameters: {
      location: `${lat},${lon},100`,
      sort: 'rating-asc',
      fields: 'profile,specialties',
      user_key: process.env.exports.apiKey
    }
  };
  return getDoctorAPI(buildURL(args));
}

//Get Conditions Call
export function getConditions(limit, skip) {
  let args = {
    url: `https://api.betterdoctor.com/2016-03-01/conditions/`,
    parameters: {
      limit: limit,
      skip: skip,
      user_key: process.env.exports.apiKey
    }
  };
  return getDoctorAPI(buildURL(args));
}

//URL Builder
function buildURL(args) {
  let parameters = "";
  Object.keys(args.parameters).forEach(key => {
    parameters += parameters === "" ? "" : "&";
    parameters += `${key}=${args.parameters[key]}`;
  });
  return `${args.url}?${parameters}`;
}

//Base API call
function getDoctorAPI(url) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();    
    request.open('GET', url, true);
    request.responseType = "json";

    request.onload = () => {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(Error('Error in Request' + request.statusText));
      }
    };

    request.onerror = () => {
      reject(Error('Network Error'));
    };

    request.send();
  });
}