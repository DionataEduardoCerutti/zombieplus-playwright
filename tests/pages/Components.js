const { expect } = require('@playwright/test');

export class Toast {

    constructor(page){
        this.page = page
    }

    async containText(message) {
        const toast = this.page.locator('.toast')
        
        //await expect(toast).toHaveText(message)//Mensagem literal
        await expect(toast).toContainText(message)//se contém a mensagem dentro da string
        //O elemento deve ficar invisível em até no máximo 5 segundos (garante que o elemento não está no html)
        //await expect(toast).toBeHidden({timeout: 5000})
        //O elemento deve ficar invisível mas pode existir no html em até no máximo 5 segundos
        await expect(toast).not.toBeVisible({timeout: 5000})
    }
}