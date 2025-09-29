import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";

import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";

router.use(requireUser);

router
  .route("/")
  .get(async (req, res) => {
    const playlists = await getPlaylists(req.user.id);
    res.send(playlists);
  })
  .post(requireBody(["name", "description"]), async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { name, description } = req.body;
    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).send(playlist);
  });

router.param("id", async (req, res, next, id) => {
  console.log(id)
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  if (playlist.user_id !== req.user.id)
    return res.status(403).send("User doesn't own playlist");

  req.playlist = playlist;
  next();
});

router.route("/:id").get((req, res) => {
  res.send(req.playlist);
});

router
  .route("/:id/tracks")
  .get(async (req, res) => {
    const playlist = await getPlaylistById(req.playlist.id);
    if (!playlist) return res.status(404).send("Playlist not found.");

    if (playlist.user_id !== req.user.id)
      return res.status(403).send("User doesn't own playlist");

    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { trackId } = req.body;
    if (!trackId) return res.status(400).send("Request body requires: trackId");

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  });
