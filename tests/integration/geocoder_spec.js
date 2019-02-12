describe('The geocoder', function() {
  it('supports searching for a sensor', function() {
  	cy.visit("/")

    cy.get('input[placeholder="Search"]').type('sensor')
    cy.get('ul.suggestions li').first().click()
  })
})