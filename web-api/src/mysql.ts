import { createConnection, Connection } from "mysql2/promise";
import config from "./config";

type Execute = (connection: Connection) => Promise<any>;

let mySqlConnection: Connection;
export const connectDB = async () => {
  try {
    mySqlConnection = await createConnection(config.mysql);
    console.log(`MySQL Connected ${mySqlConnection.config.host}`);
  } catch (e: any) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
};

const connection = async (exec: Execute) => {
  let data;
  try {
    data = exec(mySqlConnection);
  } catch (e) {
    if (mySqlConnection) {
      await mySqlConnection.rollback();
    }
    throw e;
  }
  return data;
};

export default connection;

export const idgen = () => {
  return Date.now() - 1657341308962 + Math.floor(Math.random() * 1000);
};
