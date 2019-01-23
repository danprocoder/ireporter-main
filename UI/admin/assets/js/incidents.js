function onReady(type) {
  app.table('incident-table').setRowView((data, serial, index) => {
    const viewUrl = app.http.baseUrl(`admin/view-${type}.html?id=${data.id}`);
    return `<tr>
      <td>${serial}</td>
      <td><a href="${viewUrl}">${data.title}</a></td>
      <td>${data.createdon}</td>
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
    <span>${dropdownText} <i class="fa fa-caret-down"></i></span>
    <ul class="dropdown-menu">`;
    for (let i = 0; i < statusList.length; i++) {
      dropdown += '<li><a href="#">' + formatStatus(statusList[i]); + '</a></li>';
    }
  return dropdown + '</ul></span>';
}

function loadIncidents(type) {
  app.http.api(type.concat('s')).get((data) => {
    app.table('incident-table').setDataSet(data).draw();
  }, (error) => {
    app.toast.error(`Failed to load ${type}s`);
  });
}
