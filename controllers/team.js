import { Contact } from "../models/contact.js";
import { Team } from "../models/team.js";

export const createTeam = async (req, res) => {
    try {
        const { teamName, teamDescription, teamMembers, permissions } = req.body;

        if (!teamName) {
            return res.status(400).json({ message: "Team name is required" });
        }

        if (teamMembers.length === 0) {
            return res.status(400).json({ message: "Team must have at least one member" });
        }

        const existingTeam = await Team.findOne({
            $and: [{ name: teamName }, { creater: req.user.id }]
        });

        if (existingTeam) {
            return res.status(400).json({ message: "Team already exists" });
        }

        // Create new team with permissions
        const newTeam = new Team({
            name: teamName,
            description: teamDescription,
            members: teamMembers,
            creater: req.user.id,
            permissions: permissions
        });

        await newTeam.save();
        return res.status(201).json({ team: newTeam, message: "Team created successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTeams = async (req, res) => {
    try {
        const teams = await Team.find({ members: req.user.id });
        return res.status(200).json({ teams });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const getTeam = async (req, res) => {
    try {
        const team = await Team.findOne({ _id: req.params.teamId }).populate("members");
        return res.status(200).json({ team });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const addMembers = async (req, res) => {
    try {
        const { membersId } = req.body;
        const team = await Team.findOne({ _id: req.params.teamId });
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }
        if (team.creater.toString() !== req.user.id) {
            return res.status(401).json({ message: "You are not authorized to add members to this team" });
        }

        const memberSet = new Set(team.members.map(id => id.toString()));

        membersId.forEach(id => memberSet.add(id));

        team.members = Array.from(memberSet);

        await team.save();
        return res.status(200).json({ team, message: "Members added successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const removeMember = async (req, res) => {
    try {
        const { memberId } = req.body;
        const team = await Team.findOne({ _id: req.params.teamId });
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }
        if (team.creater.toString() !== req.user.id) {
            return res.status(401).json({ message: "You are not authorized to remove members from this team" });
        }
        const index = team.members.indexOf(memberId);
        console.log(team.members)
        console.log(memberId)
        console.log(index)
        if (index === -1) {
            return res.status(404).json({ message: "Member not found in the team" });
        }
        team.members.splice(index, 1);
        await team.save();
        return res.status(200).json({ team, message: "Member removed successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}
export const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findOne({ _id: req.params.teamId });
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }
        if (team.creater.toString() !== req.user.id) {
            return res.status(401).json({ message: "You are not authorized to delete this team" });
        }

        // Find and delete all contacts associated with this team
        const contacts = await Contact.find({ teamId: req.params.teamId });
        if (contacts.length > 0) {
            await Contact.deleteMany({ teamId: req.params.teamId });
        }

        // Delete the team
        await Team.deleteOne({ _id: req.params.teamId });

        return res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTeamContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ teamId: req.params.teamId });
        return res.status(200).json({ contacts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createTeamContact = async (req, res) => {
    try {
        const { name, email, phoneNo, description } = req.body;
        const teamId = req.params.teamId;
        console.log(teamId)
        if (!name || !email || !phoneNo) {
            return res.status(400).json({ message: "Name, email and phone number are required" });
        }
        const contact = await Contact.findOne({ $and: [{ phoneNo }, { teamId }] });
        console.log(contact)
        if (contact) {
            return res.status(400).json({ message: "Contact already exists" });
        }
        const newContact = new Contact({
            name,
            email,
            phoneNo,
            description,
            creater: req.user.id,
            teamId
        });
        await newContact.save();
        return res.status(201).json({ contact: newContact, message: "Contact created successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const editTeamContact = async (req, res) => {
    try {
        const updateFields = {};
        const { name, email, phoneNo, description } = req.body;
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (phoneNo) updateFields.phoneNo = phoneNo;
        if (description) updateFields.description = description;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }
        await Contact.findOneAndUpdate({ _id: req.params.contactId }, updateFields);
        const contact =
            await Contact.findOne({ _id: req.params.contactId });
        return res.status(200).json({ message: "Contact updated successfully", contact });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteTeamContact = async (req, res) => {
    try {
        const contact = await Contact.findOne({ _id: req.params.contactId });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        await Contact.deleteOne({ _id: req.params.contactId });
        return res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updatePermission = async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(500).json({ message: "Team not found" });
        }
        console.log(team)
        const { permissions } = req.body;
        if (!permissions) {
            return res.status(400).json({ message: "Permissions are required" });
        }
        const updatedPermissions = {
            canCreate: permissions.canCreate,
            canEdit: permissions.canEdit,
            canDelete: permissions.canDelete
        }
        console.log(team)
        team.permissions = updatedPermissions;
        await team.save();
        return res.status(200).json({ message: "Permissions updated successfully", team });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}