import { Hono } from "hono";
// Pastiin import tabelnya bener namanya "membership"
import { db, membership, packages ,user } from "@repo/db"; 
import { eq } from "drizzle-orm";

const memberships = new Hono();

// GET ALL
memberships.get("/", async (c) => {
  const result = await db
  .select()
  .from(membership)
  .leftJoin(packages, eq(membership.packageId, packages.id))
  .leftJoin(user, eq(membership.userId, user.id))
  return c.json(result);
});

// CREATE (POST)
// CREATE (POST)
memberships.post("/", async (c) => {
  const data = await c.req.json();
  
  // 1. KITA CEK APA YANG DIKIRIM FRONTEND DI TERMINAL!
  console.log("Data masuk dari frontend:", data);

  // 2. Validasi satu-satu biar ketahuan yang error yang mana
  if (!data.userId) return c.json({ pesan: "userId kosong nih!" }, 400);
  if (!data.packageId) return c.json({ pesan: "packageId kosong atau bukan angka!" }, 400);
  if (!data.status) return c.json({ pesan: "status masih kosong!" }, 400);
  if (!data.startDate) return c.json({ pesan: "startDate belum diisi!" }, 400);
  if (!data.endDate) return c.json({ pesan: "endDate belum diisi!" }, 400);

  // Kalo lolos semua, baru masukin ke database
  await db.insert(membership).values({
    userId: data.userId,          
    packageId: data.packageId,    
    status: data.status,          
    startDate: data.startDate, 
    endDate: data.endDate,     
  });

  return c.json(
    {
      pesan: "Berhasil menambahkan membership",
    },
    201
  );
});

// GET BY ID
memberships.get("/:id", async (c) => {
  const idMembership = Number(c.req.param("id"));

  const data = await db
    .select()
    .from(membership)
    .where(eq(membership.id, idMembership))
    .leftJoin(packages, eq(membership.packageId, packages.id))
    .leftJoin(user, eq(membership.userId, user.id))

  if (!data.length) {
    return c.json(
      {
        userId: "",
        packageId: 0,
        status: "",
        startDate: "",
        endDate: "",
      },
      404
    );
  }

  return c.json(data[0]);
});

// UPDATE (PUT)
memberships.put("/:id", async (c) => {
  const idMembership = Number(c.req.param("id"));
  const data = await c.req.json();

  await db
    .update(membership)
    .set({
      userId: data.userId,
      packageId: data.packageId,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
    })
    .where(eq(membership.id, idMembership));

  return c.json({
    pesan: `Membership dengan ID ${idMembership} berhasil di-update`,
  });
});

// DELETE
memberships.delete("/:id", async (c) => {
  const idMembership = Number(c.req.param("id"));

  await db.delete(membership).where(eq(membership.id, idMembership));

  return c.json({
    pesan: `Membership dengan ID ${idMembership} berhasil dihapus`,
  });
});

// Jangan lupa exportnya diganti!
export default memberships;