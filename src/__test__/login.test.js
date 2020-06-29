import React from 'react'
//API mock
import { rest } from 'msw'
import { setupServer } from 'msw/node'
//test utilits
import { screen, render, fireEvent, cleanup } from '@testing-library/react'
import Login from '../login'

//1. create server
const server = setupServer(
    rest.post('http://192.168.0.210:3004/api/login', (req, res, ctx) => {
        return res( ctx.json( { token: 'fake_user_token' } ) )
 //       return res( ctx.status(500), ctx.json({ message: 'Internal server error' }) )
    })
)
beforeAll( () => server.listen() )
afterEach( () => server.resetHandlers() )
afterAll( () => server.close() )
//afterEach( cleanup )
test("тестируем логирование пользователя", async () => {
    render( <Login /> )
    //ввести имя пользователя и пароль и нажать кнопку submit заполним форму
    fireEvent.change( screen.getByLabelText(/username/i), {
        target: {value: 'chuck'}
    } )
    fireEvent.change( screen.getByLabelText(/password/i), {
        target: {value: 'norris'}
    } )
    fireEvent.click( screen.getByText(/submit/i) )

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/congrats/i)
    expect(localStorage.getItem('token')).toEqual('fake_user_token')
} )
//3. тестуруем ошибка от сервера 500
test("3. тестуруем ошибка от сервера 500", async () => {
//3.1. возвращаем 500 ошибку
    server.use(
        rest.post('http://192.168.0.210:3004/api/login', (req, res, ctx) => {
            return res(
            ctx.status(500),
            ctx.json({ message: 'Internal server error' })
            )
        })
    )
//3.2. отрисовываем компонент
    render( <Login /> )
//3.3. заполняем форму
    fireEvent.change( screen.getByLabelText(/username/i), { 
        target: {value: 'chuck'}
    } )
    fireEvent.change( screen.getByLabelText(/password/i), {
        target: {value: 'norris'}
    })
//3.4. жмем кнопку submit
    fireEvent.click( screen.getByText(/submit/i) )

    const alert = await screen.findByRole('alert')
//3.5. проверяем статус ответа
    expect(alert).toHaveTextContent(/internal server error/i)
//3.6. провряем локальное хранилище должно быть пусто\
//expect(window.localStorage.getItem('token')).toBeNull()
})
