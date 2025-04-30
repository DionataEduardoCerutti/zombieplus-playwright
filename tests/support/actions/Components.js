const { expect } = require('@playwright/test');

export class Popup {

    constructor(page){
        this.page = page
    }

    async haveText(message) {
        const element = this.page.locator('.swal2-html-container')
        
        //await expect(toast).toHaveText(message)//Mensagem literal
        await expect(element).toHaveText(message)//se contém a mensagem dentro da string
        //O elemento deve ficar invisível em até no máximo 5 segundos (garante que o elemento não está no html)
        //await expect(toast).toBeHidden({timeout: 5000})
        //O elemento deve ficar invisível mas pode existir no html em até no máximo 5 segundos
        //await expect(element).not.toBeVisible({timeout: 5000})
    }
}