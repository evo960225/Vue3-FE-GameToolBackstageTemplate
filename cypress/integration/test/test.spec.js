it('login', () => {
  cy.visit({
    url: 'http://192.168.1.48:4000', 
    failOnStatusCode: false 
  }).then((response) => {
    cy.get('#email').type('evo960225@gmail.com');
    cy.get('#password').type('asdzxc@098!').type("{enter}");
    
  })
})

it('test menu route', () => {
  cy.wait(4000)
  cy.get('aside .el-sub-menu')
    .each(($menu) =>  {
      cy.wrap($menu).within(() => {
        // 點選大項目
        // 如果是展開狀態再點一下
        if(Array($menu[0].classList).includes('is-opened')){
          cy.get('.el-sub-menu__title').click()
        }   
        cy.get('.el-sub-menu__title').click()
        cy.wait(1000)

        // 點選小項目
        cy.get('.el-menu-item')
          .each(($item) =>  {
            cy.wrap($item).click()
            cy.wait(1000)
          })
        })
    })
})