import db from "#db/client";

export async function createPlaylist(name, description, userId) {
  const sql = `
  INSERT INTO playlists
    (name, description, user_id)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [name, description, userId]);
  return playlist;
}

export async function getPlaylists(userId) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE user_id = $1
  `;
  const { rows: playlists } = await db.query(sql, [userId]);
  return playlists;
}

export async function getPlaylistById(id) {
  const sql = `
  SELECT *,
  (
    SELECT json_agg(tracks)
    FROM playlists_tracks
    JOIN tracks ON tracks.id = playlists_tracks.track_id
    WHERE playlist_id = $1
  ) AS tracks
  FROM playlists
  WHERE id = $1
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}