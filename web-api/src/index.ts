import express from "express";
import errorHandler, {
  forbiddenException,
  internalServerErrorException,
} from "./error";
import config from "./config";
import session from "express-session";
import { twitterOAuth2 } from "twitter-oauth2";
import authenticationResource from "./resource/authentication_resource";
import { connectDB as connectMySQL } from "./mysql";
import { request } from "undici";
import { createUser, getUser, User } from "./service/user_service";
const app: express.Express = express();

connectMySQL();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

// CROS対応
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT");
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Origin, X-Csrftoken, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true");

    if ("OPTIONS" === req.method) {
      res.send(200);
    } else {
      next();
    }
  }
);

app.use(
  session({
    secret: "super-secret-key",
    saveUninitialized: false,
    rolling: true,
    resave: false,
    cookie: {
      secure: "auto",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(
  twitterOAuth2({
    client_id: process.env.TWITTER_CLIENT_ID,
    client_secret: process.env.TWITTER_CLIENT_SECRET,
    redirect_uri: "http://localhost:3000/auth/twitter",
    scope: "tweet.read tweet.write users.read offline.access",
  })
);

app.post("/api/signon", async (req: express.Request, res: express.Response) => {
  const pref = req.body.pref;
  const tokenSet = req.session.tokenSet;
  if (!tokenSet || !tokenSet.access_token || !tokenSet.refresh_token) {
    throw internalServerErrorException();
  }
  const { body } = await request("https://api.twitter.com/2/users/me", {
    headers: {
      Authorization: `Bearer ${tokenSet.access_token}`,
    },
  });

  const username = (await body.json()).data.name;
  const twitter_id = (await body.json()).data.id;
  const user = await createUser(
    username,
    tokenSet.access_token,
    tokenSet.refresh_token,
    pref,
    twitter_id
  );
  console.log("create user: ", user);

  res.send();
});

app.get("/", async (req: express.Request, res: express.Response) => {
  const tokenSet = req.session.tokenSet;
  if (!tokenSet || !tokenSet.access_token || !tokenSet.refresh_token) {
    throw forbiddenException();
  }
  const { body } = await request("https://api.twitter.com/2/users/me", {
    headers: {
      Authorization: `Bearer ${tokenSet.access_token}`,
    },
  });

  const twitter_id = (await body.json()).data.id;
  const user = await getUser(twitter_id);
  if (user) {
    res.send("hello " + user.name);
  } else {
    res.send("there is not user data");
  }
});

app.use(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tokenSet = req.session.tokenSet;
    if (!tokenSet || !tokenSet.access_token || !tokenSet.refresh_token) {
      throw forbiddenException();
    }
    const { body } = await request("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${tokenSet.access_token}`,
      },
    });
    console.log("received tokens %j", req.session.tokenSet);

    const data = (await body.json()).data;
    const twitter_id = data.id;
    const user = await getUser(twitter_id);
    if (!user) {
      res.redirect("/");
    } else {
      next();
    }
  }
);

app.use("/auth", authenticationResource);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log("Start on port " + config.port + ".");
});
