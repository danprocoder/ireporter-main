const map = {
  setCoordinates(lat, long) {
    this.position = {
      lat,
      lng: long
    }
  },

  showMap() {
    const map = new google.maps.Map(
      document.getElementById('map-container'),
      {
        zoom: 4,
        center: this.position
      });
    const marker = new google.maps.Marker({
      position: this.position,
      map
    });
  }
};

function hideLoadingAnimation() {
  app.dom.selector('.preload .loader').hide();
  app.dom.selector('.preload .on-load').show();
}

function viewIncident(type) {
  const id = app.http.params['id'];
  if (typeof id == 'undefined') {
    const incidentsUrl = (type == 'red-flag' ? './red-flags.html' : './interventions.html');
    app.http.redirect(incidentsUrl);
  } else {
    const endpoint = `${type}s/${id}`;
    app.http.api(endpoint).get((data) => {
      const incident = data[0];

      // Title
      app.setTitle(`${incident.title} | iReporter`);
      app.dom.selector('.js-title-text').html(incident.title);

      // Status
      let status = incident.status.split('-');
      status = status.join(' ').toUpperCase();
      app.dom.selector('.record-status').addClass(incident.status).html(status);

      // Date
      app.dom.selector('.js-time-text').html(new Date(incident.createdon));

      // Comment
      app.dom.selector('.record-content .comment').html(incident.comment);

        // Add map
      if (incident.latitude && incident.longitude) {
        app.dom.selector('.record-content').addClass('has-map');
        app.dom.selector('.info.map').showInline();

        app.dom.selector('.js-coords-text').html(`(${incident.latitude}&deg;, ${incident.longitude}&deg;)`);
        
        // Google maps.
        map.setCoordinates(incident.latitude, incident.longitude);

        var googleMapApi = document.createElement('script');
        googleMapApi.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=map.showMap()`);
        document.head.appendChild(googleMapApi);
      }

      hideLoadingAnimation();
    }, (error) => {
      if (error.status == 404) {
        app.setTitle('Not found | iReporter');

        app.dom.selector('.main-content .container').html('<h2 style="margin-top:30px">The requested page was not found</h2>');
      }
      console.log(error);
    });
  }
}
