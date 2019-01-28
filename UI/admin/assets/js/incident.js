function onReady(type, http) {
  const id = http.params.id;
  if (!id) {
    http.redirect(http.baseUrl(`admin/${type}s.html`));
  } else {
    loadIncident(type, id);
  }
}

async function setStatusChangeListener(type, id) {
  const status = ['in-draft', 'under-investigation', 'resolved', 'rejected'];
  
  const dropdown = $('status-dd');
  dropdown.onMenuClicked((i) => {
    dropdown.disable(true).close();
    dropdown.class.add('loading');

    app.http.api(`${type}s/${id}/status`).body({
      status: status[i],
    }).patch((data) => {
      dropdown.class.remove(status).remove('loading').add(status[i]);
      dropdown.child('.selected').html(status[i].replace('-', ' ').toUpperCase());
      dropdown.disable(false);

      app.toast.success(data[0].message);
    }, (error) => {
      app.toast.error('Failed to change status at this time.');
    });
  });
}

function loadIncident(type, id) {
  app.http.api(`${type}s/${id}`).get((data) => {
    const incident = data[0];

    const title = xssClean(incident.title)
    
    // Title
    app.setTitle(`${title} | iReporter`);
    app.dom.selector('.js-text-title').html(title);

    // Date
    app.dom.selector('.js-text-date').html(app.dateFormat(incident.createdon));

    // Status
    app.dom.selector('.record-status .selected').html(incident.status.replace('-', ' ').toUpperCase());
    app.dom.selector('.record-status').addClass(incident.status);
    setStatusChangeListener(type, id);

    // Comment
    app.dom.selector('.js-text-comment').html(xssClean(incident.comment));

    // Add map
    let onContentShown = null;
    if (incident.latitude && incident.longitude) {
      app.dom.selector('.record-content').addClass('has-map');
      app.dom.selector('.info.map').showInline();

      app.dom.selector('.js-coords-text').html(`(${incident.longitude}&deg;, ${incident.latitude}&deg;)`);

      onContentShown = () => {
        app.mapbox('map-container', [incident.longitude, incident.latitude]);
      }
    }

    // Load map after showing content because offsetHeight of #map-container (mapbox
    // needs this) will return 0 if content is hidden.
    app.preloader('incident').hideLoadingAnimation(onContentShown);
  }, (error) => {
    if (error.status == 404) {
      app.setTitle('Page not found | iReporter');
    } else {
      console.log(error);
      app.toast.error('Failed to load incident');
    }
  });
}
