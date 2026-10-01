describe('Pruebas de Autenticación', () => {

  it('Debe permitir al usuario iniciar sesión correctamente', () => {
    // 1. Ir a la página donde está el formulario de login
    cy.visit('/login') // O la ruta donde esté tu formulario de inicio de sesión

    // 2. Buscar el campo de usuario/email y escribir en él
    cy.get('input[type="email"]') // Busca el input por su atributo tipo email
      .type('admin@example.com')

    // 3. Buscar el campo de contraseña y escribir
    cy.get('input[type="password"]')
      .type('T123456789')

    // 4. Hacer clic en el botón de enviar/ingresar
    cy.get('button[type="submit"]')
      .click()

    // 5. Verificación (Assert): Validar que nos redirigió al panel o muestra bienvenida
    cy.contains('Hola, Tomas').should('be.visible') // Verifica que aparezca un mensaje
  })

})