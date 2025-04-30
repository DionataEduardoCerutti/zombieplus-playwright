const { test, expect } = require('../support/')
const data = require('../support/fixtures/tvshows.json')
const { excuteSQL, executeSQL } = require('../support/database.js')

test.beforeAll(async () => {//Executa uma única vez
    await executeSQL(`DELETE FROM tvshows WHERE title NOT IN ('Fear the Walking Dead', 'Reality Z')`)//(Where devido a execução em parelelismo)
})

test('deve cadastrar uma nova série', async ({ page }) => {
    const tvshow = data.create 

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    //await tvshowsPage.create('Nome da série', 'Sinopse da série', 'Netflix', i_temporadas, i_ano)
    await page.tvshows.create({ tvshow })
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)
})

test('deve poder remover uma série', async ({ page, request }) => { 
    await executeSQL(`DELETE FROM tvshows WHERE title NOT IN ('Fear the Walking Dead')`)//Deleta todas as séries exceto 1 do teste posterior (devido a execução em parelelismo)
    const tvshow = data.to_remove
    await request.api.postTvshow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.tvshows.remove(tvshow.title)
    await page.popup.haveText('Série removida com sucesso.')
})

test('não deve cadastrar uma série já existe', async ({ page, request }) => { 
    await executeSQL(`DELETE FROM tvshows WHERE title NOT IN ('Reality Z')`)//Deleta todas as séries exceto a do teste anterior (devido a execução em parelelismo)
    const tvshow = data.duplicate
    await request.api.postTvshow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create({ tvshow })
    await page.popup.haveText(
        `O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.tabTvshows()
    await page.tvshows.goForm()
    await page.tvshows.submit()    

    await page.tvshows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])
})

test('deve realizar busca pelo termo zumbi', async ({ page, request }) => {
    const tvshows = data.search

    for (const m of tvshows.data) {
        await request.api.postTvshow(m)
    }

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.tabTvshows()
    await page.tvshows.search(tvshows.input)
    await page.tvshows.tableHave(tvshows.outputs)
})