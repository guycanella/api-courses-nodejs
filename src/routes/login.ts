import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { users } from '../database/schema.ts'
import jwt from 'jsonwebtoken'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { verify } from 'argon2'

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/sessions', {
        schema: {
            tags: ['auth'],
            summary: 'Login',
            description: 'Endpoint to login with email and password',
            body: z.object({
                email: z.email(),
                password: z.string()
            }),
            response: {
                200: z.object({
                    token: z.string()
                }).describe('Login successful.'),
                400: z.object({
                    error: z.string()
                }).describe("Couldn't create course. Invalid request parameters."),
                500: z.object({
                    error: z.string()
                }).describe("Couldn't create course. Internal server error.")
            }
        }
    }, async (request, reply) => {
        const { email, password } = request.body

        const result = await db.select()
            .from(users)
            .where(eq(users.email, email))

        if (result.length === 0) {
            return reply.status(400).send({ error: 'Invalid credentials.' })
        }

        const user = result[0]

        const passwordMatch = await verify(user.password, password)

        if (!passwordMatch) {
            return reply.status(400).send({ error: 'Invalid credentials.' })
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET must be set.')
        }

        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)

        return reply.status(200).send({ token })
    })
}