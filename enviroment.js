import { config } from "dotenv"



config({ path: '.env' })
const envs = {
    PORT : process.env.PORT || 8080,
    MONGO_URL : process.env.MONGO_URL ,
    KEY_PASSPORT : process.env.KEY_PASSPORT,
    NODE_ENV : process.env.NODE_ENV,
    SECRET_PASSPORT : process.env.SECRET_PASSPORT,
    URL_PASSPORT : process.env.URL_PASSPORT,
}


export default envs