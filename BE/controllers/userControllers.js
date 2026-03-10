const { nextTick } = require('node:process');
const { User} = require('../models/userModel');
const { Addresses } = require('../models/addressModel');
const ApiError = require('../utils/apiError');

exports.getAllUsers = async (req, res) => {
    let UserList = await User.find();
    res.json({ "message": "Welcome to my platform", "data": UserList });
}

exports.getUserById = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ message: "Unauthorized to Access" })
        }

        let user = await User.find({ _id: req.params.id }).populate('address');
        if (user.length > 0) {
            return res.status(200).json({ "msg": "User found...", "data": user })
        }
        return res.status(404).json({ "msg": "User not Found" })
    }
    catch (err) {
        return res.status(500).json({ message: "Fail", data: err.message });
    }

}

exports.editSpecificDetails = async (req, res, next) => {
    try {
        const { email, address, status, username, phoneNumber } = req.body;
        console.log("Address...");
        console.log(address);
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (String(req.user.id) !== String(req.params.id)) {
            return res.status(403).json({ message: "Unauthorized to Access" });
        }

        // Delete old address if present
        if (user.address) {
            console.log("Delete old address if present")
            await Addresses.findByIdAndDelete(user.address._id);
        }

        // Case 1: Only status update
        if (!email && !address && status) {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: { status } },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ message: "User status updated successfully", updatedData: updatedUser });
        }

        // Case 2: Email + Address update
        if (!email) return res.status(400).json({ message: "Email is missing" });

        let updatedAddress = null;
        if (address) {
            console.log("Address found...");
            updatedAddress = await Addresses.create(address);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { username, phoneNumber, email, address: updatedAddress?._id } },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: "User details updated successfully", updatedData: updatedUser });

    } catch (err) {
        next(new ApiError("Error occurred during User Profile Update", null, 500, [err.message], err.stack));
    }
};




