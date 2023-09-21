describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    const anotherUser = {
      name: 'Another Test User',
      username: 'anothertestuser',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, anotherUser)
    cy.visit('')
  })

  it('login form is shown', function() {
    cy.contains('username')
    cy.get('#username')
    cy.contains('password')
    cy.get('#password')
    cy.get('#login-button')
      .should('contain', 'login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()
      cy.contains('Test User logged in')
      cy.get('#logout-button')
        .should('contain', 'logout')

      cy.contains('create new')
      cy.contains('new blog')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'secret' })
      cy.createBlog({ title: 'First blog', author: 'First Author', url: 'www.firstblog.com' })
      cy.createBlog({ title: 'Second blog', author: 'Second Author', url: 'www.secondblog.com' })
      cy.createBlog({ title: 'Third blog', author: 'Third Author', url: 'www.thirdblog.com' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('New blog title')
      cy.get('#author').type('The Author')
      cy.get('#url').type('www.newblog.com')
      cy.contains('save').click()
      cy.contains('New blog title')
    })

    it('user can like a blog', function() {
      cy.contains('First blog')
        .find('#display-button')
        .click()

      cy.contains('First blog').find('#like').click()
      cy.contains('First blog').should('contain', 'likes 1')
    })

    it('user who created a blog can delete it', function() {
      cy.contains('First blog').find('#display-button').click()
      cy.contains('First blog').should('contain', 'Test User')
      cy.contains('First blog').find('#delete').click()
      cy.get('html').should('not.contain', 'First blog')
    })

    describe('When logged in as another user', function() {
      it('the user cannot see delete button of blog created by others', function() {
        cy.logout()
        cy.login({ username: 'anothertestuser', password: 'secret' })
        cy.createBlog({ title: 'Another test user blog', author: 'Another author', url: 'www.another.com' })
        cy.contains('First blog').find('#display-button').click()
        cy.contains('First blog').should('contain', 'Test User')
        cy.get('html').should('not.contain', 'delete')
      })
    })
  })

  it('blogs are ordered according to likes', function() {
    cy.login({ username: 'testuser', password: 'secret' })
    cy.createBlog({ title: 'First blog', author: 'First Author', url: 'www.firstblog.com', likes: 2 })
    cy.createBlog({ title: 'Second blog', author: 'Second Author', url: 'www.secondblog.com', likes: 3 })
    cy.createBlog({ title: 'Third blog', author: 'Third Author', url: 'www.thirdblog.com', likes: 1 })

    cy.get('.blog').eq(0).should('contain', 'Second blog')
    cy.get('.blog').eq(1).should('contain', 'First blog')
    cy.get('.blog').eq(2).should('contain', 'Third blog')

    cy.contains('First blog')
      .find('#display-button')
      .click()

    cy.contains('First blog').find('#like').click().click()
    cy.get('.blog').eq(0).should('contain', 'First blog')
  })
})