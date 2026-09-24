// STEP 6 - incident routes (CRUD) - every route needs a token
import { Router } from "express";
import { pool } from "./db";
import { Microservice } from "./types";
import { validateResource } from "./validate";
import { createServiceSchema, updateServiceSchema } from "./schemas";
import { authenticateToken } from "./authMiddleware";

const router = Router();

router.get("/", authenticateToken, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM microservices
       ORDER BY name DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
    });
  }
});

router.post(
  "/",
  authenticateToken,
  validateResource(createServiceSchema),
  async (req, res) => {
    const {
     name,
     endpointUrl,
     environment,
     status,
     version,
     ownerEmail,
     createdAt }: Microservice = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO microservices (name, endpointUrl, environment, status, version, ownerEmail, createdAt)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, endpointUrl, environment, status, version, ownerEmail, createdAt]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);


// ========================================
// UPDATE STATUS / SEVERITY
// PATCH /api/incidents/:id
//
// Header: Authorization: Bearer <token>
//
// Body JSON (send one or both):
// { "status": "resolved" }
// { "severity": "critical" }
//
// Response 200: { ...the updated incident }
// Response 400: no fields sent / wrong values / bad id
// Response 404: { "error": "Incident not found" }
// ========================================

router.patch(
  "/:id",
  authenticateToken,
  validateResource(updateServiceSchema),
  async (req, res) => {
    const { id } = req.params;
    const { environment, status }: Microservice = req.body;

    if (status === undefined && status === undefined) {
      return res.status(400).json({
        error: "No fields provided for update",
      });
    }

    try {
      const result = await pool.query(
        `UPDATE microservices
         SET environment = COALESCE($1, environment),
             status = COALESCE($2, status)
         WHERE id = $3
         RETURNING *`,
        [environment ?? null, status ?? null, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "microservices not found",
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);


// ========================================
// DELETE AN INCIDENT
// DELETE /api/incidents/:id
//
// Header: Authorization: Bearer <token>
//
// Response 200: { ...the deleted incident }
// Response 404: { "error": "Incident not found" }
// ========================================

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM microservices
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "microservices not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
    });
  }
});


export default router;