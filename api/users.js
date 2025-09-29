import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserByCred } from "#db/queries/users";
import { createToken } from "../utils/jwt.js";
import requireBody from "#middleware/requireBody";

router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await createUser(username, password);

      if (!user) return res.status(400).send("Username already exist");

      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      res.status(400).send(error);
    }
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await getUserByCred(username, password);

      if (!user) {
        return res.status(404).send("Username and/or Password Incorrect");
      }

      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      res.status(400).send(error);
    }
  });
