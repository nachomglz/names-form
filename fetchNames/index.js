const axios = require('axios')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const Name = mongoose.model('Name', new mongoose.Schema({
  name: String,
  genre: String,
  origin: String,
  meaning: String
})) 

let timerCounter = 1000

mongoose.connect('mongodb://localhost:27017/names').then(async () => {
  console.log("Connected to the database")

  const timer = setInterval(async () => {
    console.clear()
    // Get how many names are already in our database
    const skip = await Name.count({})

    console.log("There are currently " + skip + " names in the database")
    console.log("Fetching names... ")

    // Skip the number of elements that the databse already has
    axios.get(`https://parseapi.back4app.com/classes/Listofnames_Complete_List_Names?limit=100&skip=${skip}&order=Name`, {
      headers: {
        'x-parse-application-id': process.env.APPLICATION_ID,
        'x-parse-rest-api-key': process.env.API_KEY,
      }
    }).then(res => {
        const {results} = res.data

        if(results) {
          timerCounter = 1000
          console.log("Fetched " + results.length + " names...")

          // Insert into database
          results.forEach(result => {
            const newName = new Name({
              name: result.Name,
              genre: result.Genre,
              origin: "",
              meaning:""
            })

            // Save name
            newName.save().then(doc => {
              if(!doc) {
                console.error("error creating the name!!")
              }
            })
          })

          // Inform the names that have been created
          console.log("Names created successfully!")
        } else {
          // there was an error, wait some more seconds
          timerCounter = 5000
          console.error("There was an error, retrying in 10 seconds....")
        }


    }).catch(err => {
        timerCounter = 5000
      console.log(err)
    })

  }, timerCounter)
}).catch(err => {
  console.log("There was an error")
  console.error(err)
})







