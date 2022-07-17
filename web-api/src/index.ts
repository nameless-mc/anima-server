import express from "express";
import errorHandler from "./error";
import config from "./config";
import session from "express-session";
import { twitterOAuth2 } from "twitter-oauth2";
import authenticationResource from "./resource/authentication_resource";
import { connectDB as connectMySQL } from "./mysql";
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
    redirect_uri: "http://localhost:3000/auth/twitter/callback",
    scope: "tweet.read tweet.write users.read offline.access",
  })
);

app.use("/auth", authenticationResource);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("hogehoge")
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log("Start on port " + config.port + ".");
});
