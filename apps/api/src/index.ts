import { Hono } from "hono";
import { db, users } from "@repo/db";
import { cors } from "hono/cors";
import { eq } from 'drizzle-orm'

const app = new Hono();
app.use("/*", cors())

app.get("/", (c) => {
  return c.json({
    message: "Hello from Hono",
  });
});

app.get("/users", async (c) => {
  const result = await db.select().from(users);

  return c.json(result);
});

app.post("/users", async (c)=>{
    const data = await c.req.json()
    
    await db.insert(users).values({
        username: data.username,
        membership : data.membership,
    })
    return c.json({pesan : `berhasil nambah ${data}`})
})

app.get("users/:id", async(c) =>{
    const idUser = Number(c.req.param('id'))
    const data = await db.select().from(users).where(eq(users.id, idUser))
    
    // Kalau datanya nggak ketemu, kasih tau biar server gak crash
    if (!data.length) {
        return c.json({ username: "", membership : "" }, 404) 
    }
    
    return c.json(data[0])
})

app.put("users/:id", async(c) =>{
    const idUser = Number(c.req.param('id'))
    const data = await c.req.json()
    const setUpdate = await db.update(users).set({username:data.username, membership: data.membership}).where(eq(users.id, idUser))
    
    return c.json({pesan : `Kelas dengan ID ${setUpdate} berhasil di-update`})
})

app.delete("users/:id", async(c) =>{
    const idUser = Number(c.req.param('id'))
    const data = await db.delete(users).where(eq(users.id, idUser))

    
})
export default app;