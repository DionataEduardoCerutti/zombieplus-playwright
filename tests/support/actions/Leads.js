//const { expect } = require('@playwright/test');
import { expect } from '@playwright/test';

export class Leads {

    constructor(page){
        this.page = page
    }

    async visit(){
        await this.page.goto('/');//busca url base
    }

    async openLoadModal(){
        await this.page.getByRole('button', {name: /Aperte o play/}).click()

          //valida o label título Fila de espera
          await expect(
            this.page.getByTestId('modal').getByRole('heading')
          ).toHaveText('Fila de espera')
    }

    async submitLoeadForm(name, email){
        await this.page.getByPlaceholder('Informe seu nome').fill(name)
        await this.page.getByPlaceholder('Informe seu email').fill(email)

        await this.page.getByTestId('modal')
        .getByText('Quero entrar na fila!').click()
    }

    async alertHaveText(target){
        await expect(this.page.locator('.alert')).toHaveText(target)
    }

}