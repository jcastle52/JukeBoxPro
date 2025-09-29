import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "./queries/users.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {

  const user1 = await createUser("user1", "password123");
  const user2 = await createUser("user2", "12345678");

  const playlist1 = await createPlaylist("playlist1", "random Desc", user1.id);
  const playlist2 = await createPlaylist("playlist2", "random Desc", user2.id);
  const playlist3 = await createPlaylist("playlist3", "random Desc", user1.id);


  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  for (let i = 1; i <= 10; i++) {
    if (i <= 5) {
      await createPlaylistTrack(playlist1.id, i)
      await createPlaylistTrack(playlist3.id, i)
    } else {
      await createPlaylistTrack(playlist2.id, i)
    }
  }
}
