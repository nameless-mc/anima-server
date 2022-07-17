import express from "express";
import { request } from "undici";
import { forbiddenException } from "../error";
import { createUser, getUser } from "../service/user_service";

const router = express.Router();

router.get("/twitter", async (req: express.Request, res: express.Response) => {
  const tokenSet = req.session.tokenSet;
  if (!tokenSet || !tokenSet.access_token || !tokenSet.refresh_token) {
    throw forbiddenException();
  }
  const { body } = await request("https://api.twitter.com/2/users/me", {
    headers: {
      Authorization: `Bearer ${tokenSet.access_token}`,
    },
  });

  const data = (await body.json()).data;
  const username = data.name;
  const twitter_id = data.id;

  const user = await getUser(twitter_id);
  if (!user) {
    const user = await createUser(
      username,
      tokenSet.access_token,
      tokenSet.refresh_token,
      undefined,
      twitter_id
    );
    console.log("create user: ", user);
  }
  res.send();
});

export default router;
