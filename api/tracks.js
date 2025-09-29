import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById, getPlaylistsByTrackId } from "#db/queries/tracks";
import requireUser from "../middleware/requireUser.js";

router.use(requireUser);

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.route("/:id/playlists").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");

  const playlists = await getPlaylistsByTrackId(req.params.id, req.user.id);
  if (!playlists|| playlists.length === 0) return res.status(404).send("No playlists with that track");

  res.send(playlists);
});