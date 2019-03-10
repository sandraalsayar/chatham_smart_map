describe("The geocoder", function() {
  it("supports searching for a sensor", function() {
    cy.server();
    cy.route("GET", "https://api.mapbox.com/styles/**").as("getMap");
    cy.visit("/", {
      onBeforeLoad(win) {
        delete win.fetch;
      }
    });
    
    cy.wait("@getMap", {timeout: 35000});

    cy.get('input[placeholder="Search"]').type("sensor");
    cy.get("ul.suggestions li")
      .first()
      .click();
  });
});
