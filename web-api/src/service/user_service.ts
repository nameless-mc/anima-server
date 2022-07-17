import { badRequestException } from "../error";
import connection, { idgen } from "../mysql";

interface User {
  id: number;
  name: string;
  access_token: string;
  refresh_token: string;
  pref?: string;
}

export const createUser = async (
  name: string,
  access_token: string,
  refresh_token: string
): Promise<User> => {
  const user: User = {
    id: idgen(),
    name: name,
    access_token: access_token,
    refresh_token: refresh_token,
  };
  await connection(async (c) => {
    c.beginTransaction();
    await c.query(
      "insert into users" +
        "(id, name, access_token, refresh_token, pref)" +
        " values(?, ?, ?, ?, ?)",
      [user.id, user.name, user.access_token, user.refresh_token, null]
    );
    await c.commit();
  });
  return user;
};

export const getUser = async (access_token: string): Promise<User | undefined> => {
  const data: Array<any> = await connection(async (c) => {
    const [data] = await c.query("select * from users where access_token = ?", [
      access_token,
    ]);
    return data;
  });
  if (data.length != 1) {
    return undefined;
  }
  const user = data[0];
  return {
    id: user.id,
    name: user.name,
    access_token: user.access_token,
    refresh_token: user.refresh_token,
    pref: user.pref,
  };
};
