import assert from 'node:assert/strict'

import express from 'express'
import request from 'supertest'
import test from 'node:test'

import { healthRoutes } from '../src/routes/health.routes.js'

const createApp = (prismaClient) => {
    const app = express()
    app.use('/health', healthRoutes(prismaClient))
    return app
}

test('returns ok when the database responds', async () => {
    const prismaStub = {
        $queryRaw: async () => 1
    }

    const response = await request(createApp(prismaStub)).get('/health')

    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.body.status, 'ok')
    assert.strictEqual(response.body.database, 'connected')
    assert.match(response.body.timestamp, /^\d{4}-\d{2}-\d{2}T/)
})

test('returns 503 when the database throws', async () => {
    const prismaStub = {
        $queryRaw: async () => {
            throw new Error('boom')
        }
    }

    const response = await request(createApp(prismaStub)).get('/health')

    assert.strictEqual(response.status, 503)
    assert.strictEqual(response.body.status, 'error')
    assert.strictEqual(response.body.database, 'unavailable')
    assert.strictEqual(response.body.message, 'Database unreachable')
})
