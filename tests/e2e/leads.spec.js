//const { test, expect } = require('@playwright/test');
//const { LandingPage } = require('../pages/landingPage');
//const { Toast } = require('../pages/Components')

import { test, expect } from '../support';
import { faker } from '@faker-js/faker'; //random
/*
import { LandingPage } from '../pages/landingPage';
import { Toast }  from '../pages/Components';

let landingPage //variável
let toast 

test.beforeEach(async ({page})  => { //Executa toda a vez antes de cada teste
  landingPage = new LandingPage(page)
  toast = new Toast(page)
})
*/
//test.beforeAll(async () => {  //Executa uma única vez antes dos testes
//})

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  //const landingPage = new LandingPage(page) //feito no beforeEach

  const randomName = faker.person.fullName()// Rowan Nikolaus
  const randomEmail = faker.internet.email()// Kassandra.Haley@erich.biz

  await page.landing.visit()
  await page.landing.openLoadModal()
  await page.landing.submitLoeadForm(randomName, randomEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await page.toast.containText(message)

  //visit
 
  // openLeadModal

  //await page.click('//button[text()="Aperte o play... se tiver coragem"]')   //Funciona
  //await page.getByRole('button', {name: 'Aperte o play... se tiver coragem'}).click()   //Funciona
  //await page.getByRole('button', {name: 'Aperte o play'}).click()   //Funciona


  //submitLeadForm
 
  //await page.locator('#name').fill('papito@yahoo.com')  //Funciona  
  //await page.locator('input[name=name]').fill('papito@yahoo.com') //Funciona    
  //await page.locator('input[placeholder="Seu nome completo"]').fill('papito@yahoo.com') //Funciona

  
  //await page.getByText('Quero entrar na fila!').click() //Funciona pegando o texto do botão

  //Caso tenha mais de um botão com a mesma descrição


//para pegar o html da página    
  //await page.getByText('seus dados conosco').click()      
  //const content = await page.content()
  //console.log(content)

  // containText

  //await page.waitForTimeout(5000) //wait de 5 segundos
});

test('não deve cadastrar quando um email já existe', async ({ page, request }) => {  
  const randomName = faker.person.fullName()// Rowan Nikolaus
  const randomEmail = faker.internet.email()// Kassandra.Haley@erich.biz

  //Cadastro um lead (usuário) via API
  const newRandom = await request.post('http://localhost:3333/leads', {
    data: {
      name: randomName,
      email: randomEmail 
    }
  })

  expect(newRandom.ok()).toBeTruthy() //Confiro se criou OK

  await page.landing.visit()
  await page.landing.openLoadModal()
  await page.landing.submitLoeadForm(randomName, randomEmail)

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await page.toast.containText(message)
});

test('não deve cadastrar com email incorreto', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLoadModal()
  await page.landing.submitLoeadForm('Dionata Cerutti', 'Dionatateste.com.br')

  await page.landing.alertHaveText('Email incorreto')
});

test('não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLoadModal()
  await page.landing.submitLoeadForm('', 'Dionatateste@gmail.com')

  await page.landing.alertHaveText('Campo obrigatório')
});

test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLoadModal()
  await page.landing.submitLoeadForm('Dionata Cerutti', '')

  await page.landing.alertHaveText('Campo obrigatório')
});

test('não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLoadModal()
  await page.landing.submitLoeadForm('', '')

  //Quando apresenta duas mensagens iguais na tela, aqui dois alerts um embaixo do nome e outro embaixo do email    
  await page.landing.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])  
});