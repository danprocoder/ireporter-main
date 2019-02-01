function viewIncident(type) {
  const id = app.http.params.id;
  if (typeof id === 'undefined') {
    const incidentsUrl = (type == 'red-flag' ? './red-flags.html' : './interventions.html');
    app.http.redirect(incidentsUrl);
  } else {
    const endpoint = `${type}s/${id}`;
    app.http.api(endpoint).get((data) => {
      const incident = data[0];

      const title = xssClean(incident.title);

      // Title
      app.setTitle(`${title} | iReporter`);
      app.dom.$('.js-title-text').html(title);

      // Status
      let status = incident.status.split('-');
      status = status.join(' ').toUpperCase();
      app.dom.$('.record-status').addClass(incident.status).html(status);

      // Date
      app.dom.$('.js-time-text').html(app.dateFormat(incident.createdon));

      // Comment
      app.dom.$('.record-content .comment').html(xssClean(incident.comment));

      // Show Evidences
      showEvidences(incident.Images);

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

const showEvidences = (images) => {
  if (images.length == 0) {
    return;
  }

  const container = app.dom.$('.media-section.images .media-wrapper');
  container.show();

  for (let i = 0; i < images.length; i++) {
    container.append(new Image(images[i]));
  }
}
