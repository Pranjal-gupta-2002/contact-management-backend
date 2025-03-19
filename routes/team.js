import { Router } from 'express';
import { addMembers, createTeam, createTeamContact, deleteTeam, deleteTeamContact, editTeamContact, getTeam, getTeamContacts, getTeams, removeMember, updatePermission } from '../controllers/team.js';
import { userAuth } from "../middleware/auth.js";

const router = Router();

router.post("/create-team",userAuth,createTeam);
router.delete("/delete-team/:teamId",userAuth,deleteTeam);
router.get("/get-teams",userAuth,getTeams);
router.get("/get-team/:teamId",userAuth,getTeam);
router.post("/add-members/:teamId",userAuth,addMembers);
router.delete("/delete-members/:teamId",userAuth,removeMember);
router.get("/team-contact/:teamId",userAuth,getTeamContacts);
router.post("/create-team-contact/:teamId",userAuth,createTeamContact);
router.delete("/delete-team-contact/:contactId",userAuth,deleteTeamContact);
router.put("/edit-team-contact/:contactId",userAuth,editTeamContact);
router.put("/update-team-permission/:teamId",userAuth,updatePermission);
export default router;

