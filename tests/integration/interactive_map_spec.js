describe("The web app", function() {
  it("successfully loads", function() {
    cy.visit("/");
  });

  it("has a basic map with interactive controls", function() {
    cy.server();
    cy.route("GET", "https://api.mapbox.com/styles/**").as("getMap");
    cy.visit("/", {
      onBeforeLoad(win) {
        delete win.fetch;
      }
    });
    cy.get("#app");
    cy.get("#map"); // map element
    
    cy.wait("@getMap", {timeout: 35000});

    cy.get('[aria-label="Geolocate"]'); // geolocate
    cy.get('[aria-label="Zoom in"]').click(); // zoom in button
    cy.get('[aria-label="Zoom out"]').click(); // zoom out button
    cy.get('[aria-label="Reset bearing to north"]').click(); // bearing button
    cy.get('input[placeholder="Search"]');
  });
});
