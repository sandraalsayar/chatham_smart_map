import { subDays, format } from "date-fns";

describe("The web app", function() {
  it("has a basic map with interactive controls", function() {
    cy.get("#app");
    cy.get("#map"); // map element
    cy.get('[aria-label="Geolocate"]'); // geolocate
    cy.get('[aria-label="Zoom in"]').click(); // zoom in button
    cy.get('[aria-label="Zoom out"]').click(); // zoom out button
    cy.get('[aria-label="Reset bearing to north"]').click(); // bearing button
    cy.get('input[placeholder="Search"]'); // search bar
  });

  it("displays the console components in their default state", function() {
    // Map layers card should have sensors layer selected
    cy.get(".card").contains("MAP LAYERS");
    cy.contains("Sensors")
      .closest("li")
      .should("not.have.css", "color", "rgb(0, 0, 0)");
    cy.contains("Inundation")
      .closest("li")
      .should("have.css", "color", "rgb(0, 0, 0)");

    // Map legend card should display legend for sensors only
    cy.get(".card").contains("MAP LEGEND");
    cy.get(".legend_row").contains("Sea-level sensors");
    cy.get(".colors")
      .parent()
      .should("have.css", "display", "none");
  });

  it("displays the timelapse components in their default states", function() {
    // Timelapse components and their initial states:
    cy.get("#calender_icon"); // calendar icon present
    cy.get("#datepicker-trigger"); // datepicker input present
    cy.get("[id^=airbnb-style-datepicker-wrapper]").should(
      "have.css",
      "display",
      "none"
    );
    cy.get("#timelapse > button").contains("play_arrow"); // button with play arrow icon
    cy.get("#bar").contains("Present");
    cy.get("#bar").contains("1 day ago");
    cy.get(".v-slider__thumb-label__container").should(
      "have.css",
      "display",
      "none"
    ); // thumblabel should be hidden
    cy.get(".v-slider > input").should($el => {
      expect($el.attr("value")).to.equal($el.attr("aria-valuemax")); // slider is at max value on start
    });

    const today = new Date();
    const startDate = subDays(today, 1);

    // initial dates:
    cy.get("#datepicker-trigger")
      .invoke("val")
      .then(val => {
        expect(
          `${format(startDate, "D MMM")} - ${format(today, "D MMM")}`
        ).to.equal(val);
      });
  });

  it("updates map legend when another layer is selected", function() {
    // Map layers card should have sensors layer selected
    cy.contains("Inundation")
      .closest("li")
      .click();

    cy.contains("Sensors")
      .closest("li")
      .should("have.css", "color", "rgb(0, 0, 0)");

    cy.contains("Inundation")
      .closest("li")
      .should("not.have.css", "color", "rgb(0, 0, 0)");

    cy.get(".colors")
      .parent()
      .should("have.css", "display", "block");
  });

  it("supports interactions between timelapse components", function() {
    cy.clock();
    // Start the timelapse
    cy.get("#timelapse > button").click();
    cy.get("#timelapse > button").contains("pause");

    cy.get(".v-slider__thumb-label__container").should(
      "not.have.css",
      "display",
      "none"
    );

    cy.tick(1000);
    cy.get(".v-slider > input").should($el => {
      expect($el.attr("value")).to.equal("0"); // slider is at '0' after 1 second
    });
    // move slider once more so that it is at '1'
    cy.tick(1000);
    // Timelapse should pause when dates widget is opened
    cy.get("#datepicker-trigger").click();
    cy.get("[id^=airbnb-style-datepicker-wrapper]").should(
      "not.have.css",
      "display",
      "none"
    );
    cy.get("#timelapse > button").contains("play_arrow");
    cy.get("button")
      .contains("Cancel")
      .click(); // slider value shouldn't reset when 'Cancel' is clicked
    cy.get(".v-slider > input").should($el => {
      // slider should stay at '1'
      expect($el.attr("value")).to.equal("1");
    });
    // Timelapse should reset when 'Apply' is clicked
    cy.get("#datepicker-trigger").click({ force: true });
    cy.get("button")
      .contains("Apply")
      .click();
    cy.get("#timelapse > button").contains("play_arrow");
    cy.get(".v-slider > input").should($el => {
      // slider should stay at '1'
      expect($el.attr("value")).to.equal("0");
    });
  });
});
