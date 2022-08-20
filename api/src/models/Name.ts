import mongoose from "mongoose"


const Name = new mongoose.Schema({
  name: String,
  meaning: String,
  origin: String
})



export default mongoose.model('Name', Name)




