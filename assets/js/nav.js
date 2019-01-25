window.addEventListener('load', () => {
  app.dom.selector('#navbar .nav-toggle-responsive').click(() => {
    app.dom.selector('#navbar').toggleClass('expanded');
  });
});
