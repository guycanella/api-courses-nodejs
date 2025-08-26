import { test, expect } from 'vitest'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'

test('get course by ID', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('student')
    const course = await makeCourse()

    const response = await request(server.server)   
        .get(`/courses/${course.id}`)
        .set('Authorization', token)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        }
    })
})

test('return 404 when course does not exist', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('student')

    const response = await request(server.server)
        .get(`/courses/${faker.string.uuid()}`)
        .set('Authorization', token)
        
    expect(response.status).toBe(404)
})