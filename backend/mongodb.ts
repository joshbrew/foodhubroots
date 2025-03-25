import { getEnvVar, Routes } from "./util";
import { Db, MongoClient } from 'mongodb';

export const mongo = {} as { 
    client?:MongoClient
    db?:Db 
};

//run on init
export async function initMongoClient() {
    await new Promise((res,rej) => {
        const URI = getEnvVar('MONGODB_URI', '');
        if(URI) {
          const client = new MongoClient(URI);
          mongo.db = client.db(); //dbname in connection string
          console.log(`MongoDB Client Connected!`);
          res(true);
        }
        else {
            console.log(`No MongoDB URI provided`);
            rej(undefined);
        }
    });
}

//mongodb-specific DB calls
export const mongodbRoutes: Routes = {

};

