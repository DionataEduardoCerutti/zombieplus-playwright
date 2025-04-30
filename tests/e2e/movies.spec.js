const { test, expect } = require('../support/');
const data = require('../support/fixtures/movies.json')
const { excuteSQL, executeSQL } = require('../support/database.js')

test.beforeAll(async () => {//Quando o banco tem uma limitação executa uma única vez, banco normal para trabalhar nas
    await executeSQL(`DELETE FROM movies WHERE title NOT IN ('Resident Evil: O Hospedeiro', 'A Noite dos Mortos-Vivos')`);//empresas não tem a limitação, ou para ficar mais rápido a execução automatizada
})

test('deve cadastrar um novo filme', async ({ page }) => {
    const movie = data.create 

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    //await moviesPage.create('Nome do filme', 'Sinopse do filme', 'Netflix', '1980')
    await page.movies.create({ movie })
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('deve poder remover um filme', async ({ page, request }) => {
    await executeSQL(`DELETE FROM movies WHERE title NOT IN ('Resident Evil: O Hospedeiro')`)//Deleta todos os filmes exceto 1 do outro teste
    const movie = data.to_remove
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.remove(movie.title)
    await page.popup.haveText('Filme removido com sucesso.')
})

test('não deve cadastrar quando o título já existe', async ({ page, request }) => {
    await executeSQL(`DELETE FROM movies WHERE title NOT IN ('A Noite dos Mortos-Vivos')`)//Deleta todos os filmes exceto 1 do outro teste
    const movie = data.duplicate
    await request.api.postMovie(movie)//Não cadastra porque já ficou fixo no banco o filme

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    //por o playwright ser mult-tread, executar vários testes de uma única vez pode fallhar este teste porque
    //após criar o filme no passo postMovie um outro teste pode deletar o filme e com isso falhar a validação abaixo.
    //uma alternativa seria colocar no "await executeSQL(`DELETE FROM movies`)" do beforeAll um where com este filme
    //para não deletar e deixar fixo no banco ou deletar ele dentro deste teste e criar novamente
    await page.movies.create({ movie })
    await page.popup.haveText(
        `O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.goForm()
    await page.movies.submit()

    await page.movies.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório'
    ])
})

test('deve realizar busca pelo termo zumbi', async ({ page, request }) => {
    const movies = data.search

    movies.data.forEach(async (m) => {
        await request.api.postMovie(m)
    })

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.search(movies.input)
    await page.movies.tableHave(movies.outputs)
})