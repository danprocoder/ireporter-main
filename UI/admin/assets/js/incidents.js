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

function status(data) {
  let dropdown = `<span class="record-status ${data.status} no-select dropdown" id="status-${data.id}">
    ${data.status} <i class="fa fa-caret-down"></i>
    <ul class="dropdown-menu">`;
    for (let i = 0; i < statusList.length; i++) {
      dropdown += `<li><a href="#">${statusList[i]}</a></li>`;
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
