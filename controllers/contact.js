import { Contact } from "../models/contact.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, phoneNo, description } = req.body;
    if (!name || !email || !phoneNo) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingContact = await Contact.findOne({ $and: [{ phoneNo }, { creater: req.user.id }] });
    console.log(existingContact);
    if (existingContact) {
      return res.status(400).json({ message: "Contact already exists" });
    }
    const newContact = new Contact({
      name,
      email,
      phoneNo,
      description,
      creater: req.user.id,
    });
    await newContact.save();
    return res.status(201).json({ contact: newContact, message: "Contact created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ $and: [{ teamId:null }, { creater: req.user.id }] });
    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id });
    return res.status(200).json({ contact });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editContact = async (req, res) => {
  try {
    const updateFields = {};

    // Only add fields that are present in the request body
    if (req.body.name !== undefined) updateFields.name = req.body.name;
    if (req.body.email !== undefined) updateFields.email = req.body.email;
    if (req.body.phoneNo !== undefined) updateFields.phoneNo = req.body.phoneNo;
    if (req.body.description !== undefined)
      updateFields.description = req.body.description;

    // Check if there are any fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    await Contact.findOneAndUpdate({ _id: req.params.id }, updateFields);
    const updatedContact = await Contact.findOne({ _id: req.params.id });
    console.log(updatedContact);
    return res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteContact = async (req, res) => {
  try {
    await Contact.findOneAndDelete({ _id: req.params.id });
    return res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchContacts = async (req, res) => {
  try {
    const searchTerm = req.params.name;
    const contacts = await Contact.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { phoneNo: { $regex: searchTerm, $options: "i" } },
      ],
    });
    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
