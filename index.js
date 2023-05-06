import express from "express";
import { json } from "express";
import connectionDB from './DB/connection.js';
import * as AllRouters from "./modules/indexRouters.js";
import { nanoid } from "nanoid";
import {  qrCode_function } from "./services/qrCode.js";
//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

const port = 3000;
const app = express();
const BASE_URL = '/api/v1/ass9';
//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
connectionDB();
app.use(json());
app.use(`${BASE_URL}/user`, AllRouters.userRouter);
app.use(`${BASE_URL}/book`, AllRouters.bookRouter);
app.use(`${BASE_URL}/uploads`, express.static('./uploads'));

//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
const x = await qrCode_function({ data: 'Hello Amira , You Are Most Beauty lady Ive Ever met ! ' });
console.log({x});


app.listen(port, () => console.log(` Your Server is Working Well ....! : ON ${port}!`));