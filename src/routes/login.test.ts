import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeUser } from '../tests/factories/make-user.ts'

test('login successfully', async () => {
    await server.ready()

    const { user, passwordBeforeHash } = await makeUser()

    const response = await request(server.server)
        .post('/sessions')
        .set('Content-Type', 'application/json')
        .send({
            email: user.email,
            password: passwordBeforeHash,
        })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
        token: expect.any(String),
    })
})
