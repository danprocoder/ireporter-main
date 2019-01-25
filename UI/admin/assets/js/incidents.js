function onReady(type) {
  app.table('incident-table').setRowView((data, serial, index) => {
    const viewUrl = app.http.baseUrl(`admin/view-${type}.html?id=${data.id}`);
    return `<tr>
      <td>${serial}</td>
      <td><a href="${viewUrl}">${data.title}</a></td>
      <td>${app.dateFormat(data.createdon)}</td>
      <td>`+status(data)+`</td>
      <td>
        <a href="${viewUrl}"><i class="fa fa-eye"></i> View</a>
      </td>
    </tr>`;
  });
}

const statusList = ['in-draft', 'under-investigation', 'resolved', 'rejected'];

function formatStatus(status) {
  status = status.split('-');
  return status.join(' ');
}

function status(data) {
  const dropdownText = formatStatus(data.status).toUpperCase();

  let dropdown = `<span class="record-status ${data.status} no-select dropdown" id="status-${data.id}">
    <span class="selected">${dropdownText}</span> <i class="fa fa-caret-down"></i>
    <ul class="dropdown-menu">`;
    for (let i = 0; i < statusList.length; i++) {
      dropdown += '<li><a href="#">' + formatStatus(statusList[i]); + '</a></li>';
    }
  return dropdown + '</ul></span>';
}

function setStatusChangeListener(type, data) {
  for (let i = 0; i < data.length; i++) {
    const id = data[i].id;

    const dropdown = $(`status-${id}`);
    dropdown.onMenuClicked((i) => {
      dropdown.disable(true).close();
      dropdown.class.add('loading');

      const status = statusList[i];
      app.http.api(`${type}s/${id}/status`).body({
        status
      }).patch((data) => {
        app.toast.success(data[0].message);

        dropdown.class.remove(statusList).remove('loading').add(status);
        dropdown.disable(false);
        dropdown.child('.selected').html(status.replace('-', ' ').toUpperCase());
      }, (error) => {
        app.toast.error('Failed to change status');
      });
    });
  }
}

function loadIncidents(type) {
  app.http.api(type.concat('s')).get((data) => {
    app.table('incident-table').setDataSet(data).draw();

    initElements();
    setStatusChangeListener(type, data);

    app.preloader('incident').hideLoadingAnimation();
  }, (error) => {
    app.toast.error(`Failed to load ${type}s`);
  });
}
