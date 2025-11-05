import app from "../src/server"
import supertest from "supertest"
import { expect, test, describe } from "vitest"


describe("Test TODO Routes", async () => {
  test("test returns ok 200 /api/todos", async() => {
    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/api/todos"
    })

    expect(response.statusCode).toBe(200)
  })
})
