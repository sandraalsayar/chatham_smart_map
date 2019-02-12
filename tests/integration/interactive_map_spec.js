describe('The web app', function() {
  it('successfully loads', function() {
    cy.visit('/')
  })

  it('has a basic map with interactive controls', function () {
    cy.visit('/')
    
  	cy.get('#map') // map element
  	cy.get('[aria-label="Geolocate"]') // geolocate
  	cy.get('[aria-label="Zoom in"]').click() // zoom in button
  	cy.get('[aria-label="Zoom out"]').click() // zoom out button
  	cy.get('[aria-label="Reset bearing to north"]').click() // bearing button
  	cy.get('input[placeholder="Search"')
  })
})