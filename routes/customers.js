const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer')


router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('No Customer found');

    res.send(customer)
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    if (!customer) return res.status(404).send('No Customer found');

    return res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    try {
        await customer.save();
        console.log(customer);
        res.send(customer);
    } catch (error) {
        res.send(error.message);
    }

})
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('No Customer found');

    res.send(customer);
})

module.exports = router;