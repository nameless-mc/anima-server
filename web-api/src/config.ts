import dotenv from "dotenv";
import path from "path";
import process from "process";

dotenv.config({ path: path.join(__dirname, "../data/.env") });

export default {
  // APIサーバーの設定
  port: parseInt(process.env.PORT || "3000", 10),
  apiBasePath: process.env.API_BASE_PATH || "/api",

  // databaseの設定
  mysql: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || "3306", 10),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
  },
};
