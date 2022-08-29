import express from "express"
import Name from "../models/Name"

const NamesController = {
  createName: async (req: express.Request, res: express.Response) => {
    const { name, meaning, origin } = req.body
    if (name === undefined || name === null || name.trim().length === 0) {
      return res.status(404).send({
        status: "failed",
        message: "No name was introduced in the form",
      })
    }

    try {
      // Check if the name exists
      const doc = await Name.exists({ name: name })
      if (doc && doc._id) {
        // exits
        return res.send({
          status: "failed",
          message: "The name already exists"
        })
      } else {
        // doesn't exist
        const newName = new Name({
          name: name,
          meaning: meaning,
          origin: origin
        })

        // Save name
        newName.save().then(doc => {
          if (doc) {
            return res.send({
              status: "success",
              message: "The name has been created successfully",
              name: doc
            })
          } else {
            return res.send({
              status: "failed",
              message: "The name has not been created",
            })
          }
        })
      }
    } catch (e) {
      return res.status(400).send({
        status: "failed",
        message: "An error occured",
        errorMessage: e
      })
    }
  },

  modifyName: (req: express.Request, res: express.Response) => {
    const { _id, name, meaning, origin } = req.body
    if (_id === undefined || _id === null) {
      return res.status(404).send({
        status: "failed",
        message: "No id was introduced in the form",
      })
    }

    try {
      Name.findByIdAndUpdate(_id, { name: name, origin: origin, meaning: meaning }, { returnOriginal: false }).then(doc => {
        if (doc) {
          return res.send({
            status: "success",
            message: "Name updated correctly",
            name: doc
          })
        } else {
          return res.send({
            status: "failed",
            message: "No name was updated"
          })
        }
      })
    } catch (e) {
      return res.send({
        status: "failed",
        message: "An error occured",
        errorMessage: e
      })
    }
  },

  getNamesQuantity: async (req: express.Request, res: express.Response) => {
    const quantity = Name.countDocuments({}, (err: any, count: number) => {
      if (err) {
        return res.status(400).send({
          status: "failed",
          message: "There was an error getting the count of documents",
        })
      }
      if (count) {
        return res.send({
          status: "success",
          count
        })
      }
    });
  },

  getNames: async (req: express.Request, res: express.Response) => {
    let limit: number = parseInt(req.query.limit as string)
    limit = (limit === undefined || limit === null) ? 0 : limit

    let names = []

    if (limit === undefined || limit === null) {
      // Get all the names
      names = await Name.find().limit(limit)
    } else {
      // Get the limited items
      names = await Name.find().limit(limit)
    }

    if (names) {
      return res.send({
        status: "success",
        message: "names retrieved successfully!!",
        names
      })
    } else {
      return res.send({
        status: "failed",
        message: "No players were found"
      })
    }

  },

  deleteName: (req: express.Request, res: express.Response) => {
    const { _id } = req.body
    if (_id) {
      // Delete name from db
      Name.deleteOne({ _id }).then(doc => {
        if (doc) {
          return res.send({
            status: "success",
            message: "The name has been deleted correctly",
            name: doc
          })
        }
      }).catch(err => {
        console.log(err)
        return res.status(400).send({
          status: "failed",
          message: "There was an error trying to delete the name",
          exceptionMessage: err
        })
      })
    } else {
      return res.status(404).send({
        status: "failed",
        message: "No name was sent",
      })
    }
  }



}

export default NamesController
