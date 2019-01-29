function deleteIncident(type, id, onDelete) {
  const modal = new QuestionModal('delete-modal');
  modal.onYes(() => {
    modal.hide();

    app.http.api(`${type}s/${id}`).delete((data) => {
      onDelete(data);
    }, (error) => {
      	app.toast.error(`Failed to delete ${type}`);
    });
  });
  modal.show();
}
