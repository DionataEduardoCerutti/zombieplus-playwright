const { test } = require('../support/');
const data = require('../support/fixtures/movies.json')
const { excuteSQL, executeSQL } = require('../support/database.js')

test('deve cadastrar um novo filme', async ({ page }) => {
    const movie = data.create //Exclui no banco de dados o filme
    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`);

    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()

    //await moviesPage.create('Nome do filme', 'Sinopse do filme', 'Netflix', '1980')
    await page.movies.create(movie)
    await page.toast.containText('Cadastro realizado com sucesso!')
})



