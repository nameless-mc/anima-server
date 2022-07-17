import { badRequestException, internalServerErrorException } from "../error";
import connection, { idgen } from "../mysql";

export interface User {
  id: number;
  name: string;
  access_token: string;
  refresh_token: string;
  pref?: string;
  twitter_id: number;
}

export const createUser = async (
  name: string,
  access_token: string,
  refresh_token: string,
  pref: string | undefined,
  twitter_id: number
): Promise<User> => {
  try {
    const user: User = {
      id: idgen(),
      name: name,
      access_token: access_token,
      refresh_token: refresh_token,
      pref: pref,
      twitter_id: twitter_id,
    };
    await connection(async (c) => {
      c.beginTransaction();
      await c.query(
        "insert into users" +
          "(id, name, access_token, refresh_token, pref, twitter_id)" +
          " values(?, ?, ?, ?, ?, ?)",
        [
          user.id,
          user.name,
          user.access_token,
          user.refresh_token,
          user.pref,
          user.twitter_id,
        ]
      );
      await c.commit();
    });
    return user;
  } catch (e) {
    throw internalServerErrorException();
  }
};

export const getUser = async (
  twitter_id: number
): Promise<User | undefined> => {
  try {
    const data: Array<any> = await connection(async (c) => {
      const [data] = await c.query("select * from users where twitter_id = ?", [
        twitter_id,
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
      twitter_id: user.twitter_id,
    };
  } catch (e) {
    throw internalServerErrorException();
  }
};
