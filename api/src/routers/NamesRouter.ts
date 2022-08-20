import { Router } from "express"
import NamesController from "../controllers/NamesController"

const router = Router()


// Create routes
router.post("/create_name", NamesController.createName)
router.put("/modify_name", NamesController.modifyName)
router.get("/names", NamesController.getNames)

export default router
