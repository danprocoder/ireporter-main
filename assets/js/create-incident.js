let uploadedEvidences = [];

let submitBtn = null;


const showUploadStep = () => {
  const steps = document.querySelectorAll('.steps .step');
  steps[0].classList.remove('active');
  steps[1].classList.add('active');

  const body = document.querySelectorAll('.steps-container .step-body');
  body[0].style.display = 'none';
  body[1].style.display = 'block';

  initializeFileUploader();
};


function onSubmit(event, form, mode, http, type) {
  event.preventDefault();

  submitBtn.disabled = true;

  form.hideFieldErrors();

  const validator = new FormValidator('incident-form');
  const rules = {
    title: {
      required: 'Title is required',
    },
    comment: {
      required: 'Comment is required',
      'min_length[40]': 'Comment should be at least 40 characters',
    },
    lat: {
      optional: true,
      latitude: 'Latitude must be between -90 and 90',
    },
    long: {
      optional: true,
      longitude: 'Longitude must be between -180 and 180',
    },
  };
  if (validator.validate(rules)) {
    let url = (type === 'red-flag' ? 'red-flags' : 'interventions');
    if (mode == 'edit') {
      url += `/${http.params.id}`;
    }

    const endpoint = http.api(url).body({
      title: form.field('title').value(),
      comment: form.field('comment').value(),
      lat: form.field('lat').value(),
      long: form.field('long').value(),
    });
    const onApiSuccess = (data) => {
      const viewUrl = http.baseUrl(`view-${type}.html?id=${data[0].id}`);

      // If on add, show upload step else redirect to view page
      if (mode === 'add') {
        showUploadStep(data[0].id);
        
        app.dom.selector('.finish-btn').attribute('href', viewUrl);
      } else {
        http.redirect(viewUrl);
      }
    };
    const onApiError = (error) => {
      submitBtn.disabled = false;

      app.toast.error(`Failed to ${mode == 'edit' ? 'edit' : 'create'} ${type} record`);
      console.log(error);
    };

    if (mode == 'add') {
      endpoint.post(onApiSuccess, onApiError);
    } else if (mode == 'edit') {
      endpoint.patch(onApiSuccess, onApiError);
    }
  } else {
    form.showFieldErrors(validator.getErrors());

    submitBtn.disabled = false;
  }
}

function onReady(http, dom, type) {
  submitBtn = document.getElementById('submit-btn');

  const mode = http.params.action === 'edit' && typeof http.params.id !== 'undefined' ? 'edit' : 'add';

  const incidentForm = app.form('incident-form');

  // Pre-populate the form if mode is edit
  if (mode === 'edit') {
    const pageTitle = (type == 'red-flag' ? 'Edit Red Flag' : 'Edit Intervention');
    app.setTitle(`${pageTitle} | iReporter`);
    dom.selector('.js-text-header').html(pageTitle);
    submitBtn.value = 'Save';

    const url = (type == 'red-flag' ? 'red-flags' : 'interventions');
    http.api(`${url}/${http.params.id}`).get((data) => {
      const incident = data[0];

      incidentForm.field('title').value(incident.title);

      incidentForm.field('comment').value(incident.comment);

      if (incident.latitude && incident.longitude) {
        incidentForm.field('lat').value(incident.latitude);
        incidentForm.field('long').value(incident.longitude);
      }

      incidentForm.onsubmit((event, form) => {
        onSubmit(event, form, mode, http, type);
      });
    }, (error) => {
      if (error.status == 404) {
      }
    });
  } else if (mode === 'add') {
    const pageTitle = (type == 'red-flag' ? 'Create a Red Flag' : 'Create an Intervention');
    app.setTitle(`${pageTitle} | iReporter`);
    dom.selector('.js-text-header').html(pageTitle);
    submitBtn.value = 'Next';

    incidentForm.onsubmit((event, form) => {
      onSubmit(event, form, mode, http, type);
    });
  }
}

const initializeFileUploader = () => {
  app.dom.selector('.upload-btn').click((event) => {
    app.cloudinary().open('.upload-btn', onEvidenceUploaded);

    event.preventDefault();
  });
};

const onEvidenceUploaded = (data) => {
  app.dom.selector('.uploader-container').hide();
  app.dom.selector('.uploaded-files').show();

  app.dom.selector('.uploaded-files .uploaded-thumbnails').append(new Image(data.secureUrl));

  uploadedEvidences.push(data);
};
