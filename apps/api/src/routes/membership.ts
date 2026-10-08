import { Hono } from "hono";
// Pastiin import tabelnya bener namanya "membership"
import { db, membership, packages } from "@repo/db"; 
import { eq } from "drizzle-orm";

const memberships = new Hono();

// GET ALL
memberships.get("/", async (c) => {
  const result = await db
  .select()
  .from(membership)
  .leftJoin(packages, eq(membership.packageId, packages.id));
  return c.json(result);
});

// CREATE (POST)
memberships.post("/", async (c) => {
  const data = await c.req.json();

  // Validasi: Cek 5 kolom wajib diisi
  if (!data.userId || !data.packageId || !data.active || !data.startDate || !data.endDate) {
    return c.json(
      {
        pesan: "userId, packageId, active, startDate, dan endDate wajib diisi",
      },
      400
    );
  }

  // Insert ke tabel membership
  await db.insert(membership).values({
    userId: data.userId,          // Text (karena tabel user asli belum ada)
    packageId: data.packageId,    // Number (Foreign key ke packages)
    status: data.status,          // Enum: "active" | "expired" | "cancelled"
    startDate: data.startDate, // Convert string ke format Date
    endDate: data.endDate,     // Convert string ke format Date
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
    .leftJoin(packages, eq(membership.packageId, packages.id));

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