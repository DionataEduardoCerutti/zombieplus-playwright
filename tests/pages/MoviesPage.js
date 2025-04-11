import { th } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { Toast } from './Components';

export class MoviesPage {
    constructor(page) {
        this.page = page
    }

    async isLoggedIn() {
        //const logoutLink = this.page.locator('a[href="/logout"]')
        //await expect(logoutLink).toBeVisible()
        await this.page.waitForLoadState('networkidle')//aguarda carregar a página (até terminar todo o tráfico de rede)
        await expect(this.page).toHaveURL(/.*admin/)//valida se contém na url a substring 'admin'
    }

    async create({title, overview, company, release_year}) {
        await this.page.locator('a[href$="register"]').click()

        //await this.page.locator('#title').fill(title)
        await this.page.getByLabel('Titulo do filme').fill(title)//label que tem o for o mesmo nome do id ou name do campo
        await this.page.getByLabel('Sinopse').fill(overview)

        await this.page.locator('#select_company_id .react-select__indicator').click()

        //para pegar o html da página, rodar e ir na aba console e copiar, colar em um arquivo .html e formatar o documento
        //const html = await this.page.content()
        //console.log(html)
        await this.page.locator('.react-select__option')
            .filter({ hasText: company })
            .click()

        await this.page.locator('#select_year .react-select__indicator').click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: release_year })
            .click()            

        await this.page.getByRole('button', {name: 'cadastrar'}).click()         
        
        
    }

}