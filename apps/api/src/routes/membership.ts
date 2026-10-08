import { Hono } from "hono";
import { db, membership } from "@repo/db";
import { eq } from "drizzle-orm";

const memberships = new Hono();

memberships.get("/", async (c) => {
  const result = await db.select().from(membership);
  return c.json(result);
});

memberships.post("/", async (c) => {
  const data = await c.req.json();

  if (!data.username || !data.membership) {
    return c.json(
      {
        pesan: "Username dan membership wajib diisi",
      },
      400
    );
  }

  await db.insert(users).values({
    username: data.username,
    membership: data.membership,
  });

  return c.json(
    {
      pesan: "Berhasil menambahkan user",
    },
    201
  );
});

user.get("/:id", async (c) => {
  // GANTI JADI idUser (tanpa s)
  const idUser = Number(c.req.param("id"));

  const data = await db
    .select()
    .from(users)
    .where(eq(users.id, idUser));

  if (!data.length) {
    return c.json(
      {
        username: "",
        membership: "",
      },
      404
    );
  }

  return c.json(data[0]);
});

user.put("/:id", async (c) => {
  // Ini udah bener dari awal
  const idUser = Number(c.req.param("id"));
  const data = await c.req.json();

  await db
    .update(users)
    .set({
      username: data.username,
      membership: data.membership,
    })
    .where(eq(users.id, idUser));

  return c.json({
    pesan: `User dengan ID ${idUser} berhasil di-update`,
  });
});

user.delete("/:id", async (c) => {
  // GANTI JADI idUser (tanpa s)
  const idUser = Number(c.req.param("id"));

  await db.delete(users).where(eq(users.id, idUser));

  return c.json({
    pesan: `User dengan ID ${idUser} berhasil dihapus`,
  });
});

export default user;