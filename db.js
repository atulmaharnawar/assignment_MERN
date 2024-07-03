require('dotenv').config()
const mongoose=require('mongoose');

const mongoURI = process.env.DATABASE_URI;

const connectToMongo = () => {
    main().catch(err => console.log(err));
    async function main() {
        await mongoose.connect(mongoURI);
        console.log("Connected to database!");
    }

}

module.exports=connectToMongo;