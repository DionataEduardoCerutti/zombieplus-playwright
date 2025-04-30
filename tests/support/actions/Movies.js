import { th } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { Toast } from './Components';

export class Movies {
    constructor(page) {
        this.page = page
    }

    async goForm() {
        await this.page.locator('a[href$="register"]').click()
    }

    async submit() {
        await this.page.getByRole('button', { name: 'cadastrar' }).click()
    }

    //async create({title, overview, company, release_year}) {
    async create({ movie }) {
        await this.goForm()

        //await this.page.locator('#title').fill(title)
        await this.page.getByLabel('Titulo do filme').fill(movie.title)//label que tem o for o mesmo nome do id ou name do campo
        await this.page.getByLabel('Sinopse').fill(movie.overview)

        await this.page.locator('#select_company_id .react-select__indicator').click()

        //para pegar o html da página, rodar e ir na aba console e copiar, colar em um arquivo .html e formatar o documento
        //const html = await this.page.content()
        //console.log(html)
        await this.page.locator('.react-select__option')
            .filter({ hasText: movie.company })
            .click()

        await this.page.locator('#select_year .react-select__indicator').click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: movie.release_year })
            .click()

        await this.page.locator('input[name=cover]')
            .setInputFiles('tests/support/fixtures' + movie.cover)

        if (movie.featured) { //Se for verdadeiro entra
            await this.page.locator('.featured .react-switch').click()
        }

        await this.submit()
    }

    async search(target) {
        await this.page.getByPlaceholder('Busque pelo nome')
            .fill(target)

        await this.page.click('.actions button')
    }

    async tableHave(content) {
        const rows = this.page.getByRole('row')
        await expect(rows).toContainText(content)//valida se nas linhas retornadas contém os 3 textos
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target)
    }

    async remove(title) {
        await this.page.getByRole('row', { name: title }).getByRole('button').click() //Filtra a linha que tem o nome do título
        await this.page.click('.confirm-removal')
    }

}