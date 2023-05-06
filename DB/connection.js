import mongoose from "mongoose";

const connectionDB = async () =>
{
    return await mongoose
        .connect('mongodb://localhost:27017/Ass8')
        .then((data) => console.log("DB Connected .......!!"))
        .catch((err) => console.log('DB Connection Failed !!'));
};
export default connectionDB;
// mongoose.set("strictQuery", true);