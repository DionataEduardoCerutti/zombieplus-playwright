const { test : base, expect } = require('@playwright/test')

const { LoginPage } = require('../pages/LoginPage')
const { Toast } = require('../pages/Components')
const { MoviesPage } = require('../pages/MoviesPage')
const { LandingPage } = require('../pages/landingPage');

const test = base.extend({
    page: async ({page}, use) => {
        await use({
            ...page, //o contexto page vai ter todos os recursos do contexto original do page e mais o que eu adicionar abaix
            landing: new LandingPage(page),
            login: new LoginPage(page),
            movies: new MoviesPage(page),
            toast: new Toast(page)
        })
    }
})

export { test, expect } //exporta o objeto test