function initTable(type) {
  const viewUrl = `./view-${type}.html`;
  const editUrl = `./create-${type}.html`;

  app.table('incident-table').setRowView((data, serial, index) => {
    const status = data.status.replace('-', ' ').toUpperCase();

  	let row = `<tr>
  	  <td>${serial}</td>
  	  <td><a href="${viewUrl}?id=${data.id}">${data.title}</a></td>
  	  <td>${data.createdon}</td>
  	  <td><span class="record-status no-select ${data.status}">${status}</span></td>
  	  <td>
  	    <a href="${viewUrl}?id=${data.id}" class="action blue"><i class="fa fa-eye"></i> View</a>`;
  	if (data.status == 'in-draft') {
  	  row += `
  	    <a href="${editUrl}?action=edit&id=${data.id}" class="action blue"><i class="fa fa-pencil"></i> Edit</a>
  	    <a href="#" class="action red" onClick="deleteIncident(${index})"><i class="fa fa-trash"></i> Delete</a>`;
  	}
  	row += '</td></tr>';
  	return row;
  });
}

function loadIncidents(http, type) {
  http.api(type + 's').get((data) => {
  	app.table('incident-table').setDataSet(data).draw();
  }, (error) => {
    app.toast.error('Failed to load ' + type + 's');
    console.log(error);
  });
}
