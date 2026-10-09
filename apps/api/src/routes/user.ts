import { Hono } from "hono";
import { db, user } from "@repo/db";
import { eq } from "drizzle-orm";

// Pake nama variabel router yang aman biar gak tabrakan sama nama tabel "user"
const userAuth = new Hono();

// GET ALL
userAuth.get("/", async (c) => {
  const result = await db.select().from(user);
  return c.json(result);
});

// CREATE (POST)
userAuth.post("/", async (c) => {
  const data = await c.req.json();

  // Validasi: id, name, dan email wajib ada
  if (!data.id || !data.name || !data.email) {
    return c.json(
      {
        pesan: "id, name, dan email wajib diisi",
      },
      400
    );
  }

  // Insert ke tabel user
  await db.insert(user).values({
    id: data.id,
    name: data.name,
    email: data.email,
    image: data.image || null, // Optional
    emailVerified: data.emailVerified || false, // Default false kalau gak dikirim
  });

  return c.json(
    {
      pesan: "Berhasil menambahkan user",
    },
    201
  );
});

// GET BY ID
userAuth.get("/:id", async (c) => {
  // ID sekarang STRING, jadi gak pake Number() lagi!
  const idUser = c.req.param("id");

  const data = await db
    .select()
    .from(user) // Pake tabel "user", bukan "users"
    .where(eq(user.id, idUser));

  if (!data.length) {
    return c.json({ pesan: "User tidak ditemukan" }, 404);
  }

  return c.json(data[0]);
});

// UPDATE (PUT)
userAuth.put("/:id", async (c) => {
  const idUser = c.req.param("id");
  const data = await c.req.json();

  await db
    .update(user)
    .set({
      name: data.name,
      email: data.email,
      image: data.image,
      emailVerified: data.emailVerified,
      // updatedAt nggak usah ditulis, udah diurus otomatis sama .$onUpdate() di Drizzle
    })
    .where(eq(user.id, idUser));

  return c.json({
    pesan: `User dengan ID ${idUser} berhasil di-update`,
  });
});

// DELETE
userAuth.delete("/:id", async (c) => {
  const idUser = c.req.param("id");

  await db.delete(user).where(eq(user.id, idUser));

  return c.json({
    pesan: `User dengan ID ${idUser} berhasil dihapus`,
  });
});

// Ekspor routernya, bukan tabelnya!
export default userAuth;