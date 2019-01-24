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
      let onContentShown = null;
      if (incident.latitude && incident.longitude) {
        app.dom.selector('.record-content').addClass('has-map');
        app.dom.selector('.info.map').showInline();

        app.dom.selector('.js-coords-text').html(`(${incident.latitude}&deg;, ${incident.longitude}&deg;)`);
        
        // Mapbox
        onContentShown = () => {
          app.mapbox('map-container', [incident.longitude, incident.latitude]);
        };
      }

      app.preloader('incident').hideLoadingAnimation(onContentShown);
    }, (error) => {
      if (error.status == 404) {
        app.setTitle('Not found | iReporter');

        app.dom.selector('.main-content .container').html('<h2 style="margin-top:30px">The requested page was not found</h2>');
      }
      console.log(error);
    });
  }
}
