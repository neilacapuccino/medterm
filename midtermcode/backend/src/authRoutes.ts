import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "./db";
import jwt from "jsonwebtoken";
import { validateResource } from "./validate";      // STEP 4
import { loginSchema } from "./schemas";            // STEP 4

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

//testing only
router.get("/login", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users
       ORDER BY id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
    });
  }
});

router.post(
  "/login",
  validateResource(loginSchema),   // STEP 4: added after making validate.ts + schemas.ts
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await pool.query(
        `SELECT * FROM users
         WHERE email = $1`,
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);


export default router;
