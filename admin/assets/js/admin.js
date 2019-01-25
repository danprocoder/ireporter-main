window.addEventListener('load', (e) => {
  app.dom.selector('#top .responsive-toggle').click(() => {
    app.dom.selector('.main-content .sidenav').toggleClass('expanded');
  });
});
