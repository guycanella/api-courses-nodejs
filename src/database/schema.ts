import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', [
    'student',
    'manager',
])

export const users = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    email: text().notNull().unique(),
    name: text().notNull(),
    password: text().notNull(),
    role: userRole().notNull().default('student'),
})

export const courses = pgTable('courses', {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull().unique(),
    description: text(),
})

export const enrollments = pgTable('enrollments', {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid().notNull().references(() => courses.id, { onDelete: 'cascade' }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})