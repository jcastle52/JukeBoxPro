import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(username, password) {
    const checkForUser = await getUserByCred(username, password)
    if (checkForUser) return null;

    const SQL = `
    INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *
    `;
    const hashedPassword = await bcrypt.hash(password, 10);
    const {
        rows: [user],
    } = await db.query(SQL, [username, hashedPassword]);
    return user;
}

export async function getUserByCred(username, password) {
    const SQL = `
    SELECT * FROM users
    WHERE username = $1
    `;
    const {
     rows: [user] 
    } = await db.query(SQL, [username]);
    if(!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return user;
}

export async function getUserById(id) {
    const SQL = `
    SELECT * FROM users
    WHERE id = $1
    `;
    const {
        rows: [user]
    } = await db.query(SQL, [id]);
    return user
}