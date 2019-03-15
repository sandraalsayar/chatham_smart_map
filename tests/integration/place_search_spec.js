describe("When searching for a place", function() {
  beforeEach(function() {
    cy.get('input[placeholder="Search"]')
      .clear()
      .type("Savannah, Georgia");
    cy.wait(2000);
    cy.get("ul.suggestions li")
      .first()
      .click();
  });

  it("a marker is dropped on the map", function() {
    cy.get(".mapboxgl-marker");
  });

  it("marker disappears when close icon is clicked", function() {
    cy.get(".geocoder-icon.geocoder-icon-close").click();
    cy.get(".mapboxgl-marker").should("not.exist");
  });

  it("marker disappears when a sensor is searched for", function() {
    cy.get('input[placeholder="Search"]')
      .clear()
      .type("sensor");
    cy.wait(2000);
    cy.get("ul.suggestions li")
      .first()
      .click();

    cy.get(".mapboxgl-marker").should("not.exist");
  });

  it("marker disappears when a sensor is clicked", function() {
    cy.window().should("have.property", "map");
    cy.window().then(win => {
      const map = win.map;
      try {
        // map.fire(
        //   "click",
        //   map.queryRenderedFeatures({ layers: ["outer_point"] })[0].geometry
        //     .coordinates
        // );
        map.fire("click", "outer_point");
      } catch (error) {
        // empty
      } finally {
        cy.get(".mapboxgl-marker").should("not.exist");
      }
    });
  });
});
