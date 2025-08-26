import { test, expect } from 'vitest'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { server } from '../app.ts'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'

test('create successfully a course', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('manager')

    const response = await request(server.server)
        .post('/courses')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({
            title: faker.lorem.words(4),
            description: faker.lorem.words(4),
        })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
        courseId: expect.any(String),
    })
})
