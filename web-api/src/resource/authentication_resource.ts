import express, { Response } from "express";
import { request } from "undici";

const router = express.Router();

router.get("/twitter/callback", async (req: express.Request, res: express.Response) => {
  const tokenSet = req.session.tokenSet;
  console.log(req.session);
  
  console.log("received tokens %j", req.session.tokenSet);
  const { body } = await request("https://api.twitter.com/2/users/me", {
    headers: {
      Authorization: `Bearer ${tokenSet?.access_token}`,
    },
  });
  
  const username = (await body.json()).data.name;
  res.send(`Hello ${username}!`);
});

export default router