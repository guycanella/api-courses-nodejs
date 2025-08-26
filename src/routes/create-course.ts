import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import { checkUserRole } from './hooks/check-user-role.ts'
import { checkRequestJWT } from './hooks/check-request-jwt.ts'

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/courses', {
        preHandler: [checkRequestJWT, checkUserRole('manager')],
        schema: {
            tags: ['courses'],
            summary: 'Create a new course',
            description: 'Endpoint to create a new course with title and optional description',
            body: z.object({
                title: z.string().min(5, 'Title must be at least 5 characters long'),
                description: z.string().optional()
            }),
            response: {
                201: z.object({
                    courseId: z.uuid()
                }).describe('Course is successfully created'),
                400: z.object({
                    error: z.string()
                }).describe("Couldn't create course. Invalid request parameters."),
                500: z.object({
                    error: z.string()
                }).describe("Couldn't create course. Internal server error.")
            }
        }
    }, async (request, reply) => {
        const { title, description } = request.body

        if (!title) {
            return reply.status(400).send({ error: 'Title is required' })
        }

        const courseCreated = await db
            .insert(courses)
            .values({ title, description })
            .returning()

        if (!courseCreated) {
            return reply.status(500).send({ error: 'Failed to create course' })
        }

        return reply.status(201).send({ courseId: courseCreated[0].id })
    })
}