import { Hono } from "hono";
import { db, packages } from "@repo/db";
import { eq } from "drizzle-orm";

const pack = new Hono();

pack.get("/", async (c) => {
  const result = await db.select().from(packages);
  return c.json(result);
});

pack.post("/", async (c) => {
  const data = await c.req.json();

  // Validasi: Cek 4 kolom wajib
  if (!data.name || !data.description || !data.price || !data.durations) {
    return c.json(
      {
        pesan: "Name, description, price, dan durations wajib diisi",
      },
      400
    );
  }

  // Insert ke tabel packages
  await db.insert(packages).values({
    name: data.name,
    description: data.description,
    price: data.price,
    duration: data.durations,
  });

  return c.json(
    {
      pesan: "Berhasil menambahkan package",
    },
    201
  );
});

pack.get("/:id", async (c) => {
  const idPackage = Number(c.req.param("id"));

  const data = await db
    .select()
    .from(packages)
    .where(eq(packages.id, idPackage));

  if (!data.length) {
    return c.json(
      {
        name: "",
        description: "",
        price: 0,
        durations: "", // Sesuaikan sama tipe data di schema lu ya (bisa string atau number)
      },
      404
    );
  }

  return c.json(data[0]);
});

pack.put("/:id", async (c) => {
  const idPackage = Number(c.req.param("id"));
  const data = await c.req.json();

  await db
    .update(packages)
    .set({
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.durations,
    })
    .where(eq(packages.id, idPackage));

  return c.json({
    pesan: `Package dengan ID ${idPackage} berhasil di-update`,
  });
});

pack.delete("/:id", async (c) => {
  const idPackage = Number(c.req.param("id"));

  await db.delete(packages).where(eq(packages.id, idPackage));

  return c.json({
    pesan: `Package dengan ID ${idPackage} berhasil dihapus`,
  });
});

// Jangan lupa exportnya diganti jadi pack
export default pack;