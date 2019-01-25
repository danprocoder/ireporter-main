function initTable(type) {
  const viewUrl = `./view-${type}.html`;
  const editUrl = `./create-${type}.html`;

  app.table('incident-table').setRowView((data, serial, index) => {
    const status = data.status.replace('-', ' ').toUpperCase();

  	let row = `<tr>
  	  <td>${serial}</td>
  	  <td><a href="${viewUrl}?id=${data.id}">${data.title}</a></td>
  	  <td>${app.dateFormat(data.createdon)}</td>
  	  <td><span class="record-status no-select ${data.status}">${status}</span></td>
  	  <td>
  	    <a href="${viewUrl}?id=${data.id}" class="action blue"><i class="fa fa-eye"></i> View</a>`;
  	if (data.status == 'in-draft') {
  	  row += `
  	    <a href="${editUrl}?action=edit&id=${data.id}" class="action blue"><i class="fa fa-pencil"></i> Edit</a>
  	    <a href="#" class="action red" onclick="onClickDelete('${type}', ${index})"><i class="fa fa-trash"></i> Delete</a>`;
  	}
  	row += '</td></tr>';
  	return row;
  });
}

function loadIncidents(http, type) {
  http.api(type + 's').get((data) => {
  	app.table('incident-table').setDataSet(data).draw();

    app.preloader('incident').hideLoadingAnimation();
  }, (error) => {
    app.toast.error('Failed to load ' + type + 's');
    console.log(error);
  });
}

function onClickDelete(type, index) {
  const table = app.table('incident-table');
  const id = table.dataAt(index).id;

  deleteIncident(type, id, (data) => {
  	table.remove(index);

    app.toast.success(data[0].message);
  });
}
