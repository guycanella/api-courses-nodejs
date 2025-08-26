import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'

test('get courses', async () => {
    await server.ready()

    const title = "tricesimus convoco aedificium cogo"

    const { token } = await makeAuthenticatedUser('manager')

    const response = await request(server.server)
        .get(`/courses?search=${title}`)
        .set('Authorization', token)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
        total: expect.any(Number),
        courses: [
            {
                id: expect.any(String),
                title: title,
                enrollments: 0,
            }
        ]
    })
})