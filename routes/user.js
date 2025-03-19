import { Router } from "express";
import { userRegister,userLogin, userLogout, me, searchUser, userDelete, userGetAll, changeRole } from "../controllers/user.js";
import { userAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register",userRegister);
router.post("/login",userLogin);
router.get("/logout",userLogout);
router.get("/me",userAuth,me);
router.get("/search/:name", userAuth,searchUser)
router.delete("/delete/:id", userAuth,userDelete)
router.get("/getAllUsers", userAuth,userGetAll)
router.put("/changeRole/:userId", userAuth,changeRole)

export default router;  // Export the router
