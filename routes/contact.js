import { Router } from "express";
import { createContact, deleteContact, editContact, getContact, getContacts, searchContacts } from "../controllers/contact.js";
import { userAuth } from "../middleware/auth.js";

const router = Router();

router.post("/new", userAuth,createContact)
router.get("/get", userAuth,getContacts)
router.get("/get/:id", userAuth,getContact)
router.put("/edit/:id", userAuth,editContact)
router.delete("/delete/:id", userAuth,deleteContact)
router.get("/search/:name", userAuth,searchContacts)

export default router;  