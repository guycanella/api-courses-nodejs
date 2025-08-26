import fastify from 'fastify'
import { fastifySwagger } from '@fastify/swagger'
import scalarAPIReference from '@scalar/fastify-api-reference'

import { 
    validatorCompiler, 
    serializerCompiler, 
    type ZodTypeProvider,
    jsonSchemaTransform
} 
from 'fastify-type-provider-zod'

import { getCourseByIdRoute } from './routes/get-course-by-id.ts'
import { createCourseRoute } from './routes/create-course.ts'
import { getCoursesRoute } from './routes/get-courses.ts'
import { loginRoute } from './routes/login.ts'

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
            }
        }
    }
}).withTypeProvider<ZodTypeProvider>()

if (process.env.NODE_ENV === 'development') {
    server.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'API Documentation',
                description: 'API documentation for the courses API',
                version: '1.0.0'
            },
            servers: [
                {
                    url: 'http://localhost:3333',
                    description: 'Local server'
                }
            ]
        },
        transform: jsonSchemaTransform
    })

    await server.register(scalarAPIReference, {
    routePrefix: '/docs',
    })
}

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(getCourseByIdRoute)
server.register(createCourseRoute)
server.register(getCoursesRoute)
server.register(loginRoute)

export { server }