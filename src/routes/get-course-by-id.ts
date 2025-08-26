import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { checkRequestJWT } from './hooks/check-request-jwt.ts'
import { getAuthenticatedUserFromRequest } from '../utils/get-authenticated-user-from-request.ts'

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.get('/courses/:id', {
        preHandler: checkRequestJWT,
        schema: {
            tags: ['courses'],
            summary: 'Get course by ID',
            description: 'Endpoint to retrieve a course by its ID',
            params: z.object({
                id: z.uuid()
            }),
            response: {
                200: z.object({
                    course: z.object({
                        id: z.uuid(),
                        title: z.string(),
                        description: z.string().nullable()
                    })
                }).describe('Course is successfully retrieved'),
                404: z.object({
                    error: z.string()
                }).describe("Couldn't retrieve course. Course not found."),
                500: z.object({
                    error: z.string()
                }).describe("Couldn't retrieve course. Internal server error.")
            }
        },
    },  async (request, reply) => {
            const { id } = request.params
            const user = getAuthenticatedUserFromRequest(request)

            const result = await db
                .select()
                .from(courses)
                .where(eq(courses.id, id))

            if (result.length === 0) {
                return reply.status(404).send({ error: 'Course not found' })
            }

            return reply.status(200).send({ course: result[0] })
        }
    )
}