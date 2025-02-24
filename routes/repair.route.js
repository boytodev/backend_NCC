const express = require('express');
const repairRoute = express.Router();

// repair model
let repairModel = require('../models/formRepair');

// Get all data
repairRoute.route('/').get(async (req, res, next) => {
    try {
        const data = await repairModel.find();
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Create repair data (updated with async/await)
repairRoute.route('/create-repair').post(async (req, res, next) => {
    try {
        const data = await repairModel.create(req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Edit repair data
repairRoute.route('/edit-repair/:id').get(async (req, res, next) => {
    try {
        const data = await repairModel.findById(req.params.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Update repair data (updated with async/await)
repairRoute.route('/update-repair/:id').put(async (req, res, next) => {
    try {
        const data = await repairModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true }); // ค่าที่อัปเดตจะถูกส่งกลับ
        res.json(data);
        console.log('repair successfully updated');
    } catch (error) {
        next(error);
    }
});

// Delete repair data
repairRoute.route('/delete-repair/:id').delete(async (req, res, next) => {
    try {
        const data = await repairModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: data });
    } catch (error) {
        next(error);
    }
});

module.exports = repairRoute;
