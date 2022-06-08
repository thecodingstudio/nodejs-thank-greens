const User = require('../models/user');
const Address = require('../models/address');
const Coupon = require('../models/coupon');

/*
 * Get profile for every user.
*/
exports.getProfile = (req, res, next) => {

    // Find user through email.
    User.findOne({ where: { id: req.user_id } })
        .then(async user => {

            // Chech whether user is exist or not.
            if (!user) {
                const error = new Error('User not exists!');
                error.statusCode = 404;
                throw error;
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                phone: user.country_code + user.phone
            }

            // Send customer details.
            return res.status(200).json({
                message: 'Fetch customer successfully',
                data: payload
            });

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}


/*
 * Update profile for every user.
*/
exports.updateProfile = (req, res, next) => {
    const postData = req.body;

    // // Find user through email.
    User.findOne({ where: { id: req.user_id } })
        .then(async user => {

            // Chech whether user is exist or not.
            if (!user) {
                const error = new Error('User not exists!');
                error.statusCode = 404;
                throw error;
            }

            // Updata user data if it is change.
            user.name = postData.name || user.name;
            user.email = postData.newEmail || user.email;
            user.picture = postData.picture || user.picture;
            user.phone = postData.phone || user.phone;
            user.country_code = postData.country_code || user.country_code;

            // Save updated customer data to database
            await user.save();

            return res.status(200).json({ message: 'Update customer successfully' });

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}


/*
 * Add new address for every user.
*/
exports.postAddress = async (req, res, next) => {

    const payload = {
        primary_address: req.body.primary_address,
        addition_address_info: req.body.addition_address_info,
        address_type: req.body.address_type || 0,
        latitude: req.body.latitude || 21.228125,
        longitude: req.body.longitude || 72.833771,
        is_select: req.body.is_select || 0,
        userId: req.user_id
    }

    if (payload.is_select === 1) {
        const address = await Address.findOne({ where: { userId: req.user_id, is_select: 1 } });
        // for (let i = 0; i < address.length; i++) {
        if (address) {
            address.is_select = 0;
            await address.save();
        }
        // }
    }

    // Create new address in database.
    try {
        const address = await Address.create(payload);

        return res.status(200).json({
            message: 'Address added successfully',
            data: address
        });

    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


/*
 * Update exist address for every user.
*/
exports.updateAddress = (req, res, next) => {

    // Find address through address id.
    Address.findOne({ where: { id: req.params.id } })
        .then(async address => {

            // Check whether address is exist or not.
            if (address === null) {
                const error = new Error('Address not found!');
                error.statusCode = 404;
                throw error;
            }

            // Updata address data if it is change. 
            try {

                address.primary_address = req.body.primary_address || address.primary_address;
                address.addition_address_info = req.body.addition_address_info || address.addition_address_info;
                address.address_type = req.body.address_type || address.address_type;
                address.latitude = req.body.latitude || address.latitude;
                address.longitude = req.body.longitude || address.longitude;
                address.is_select = req.body.is_select || address.is_select;

                if (req.body.is_select === 1) {
                    const address = await Address.findOne({ where: { userId: req.user_id, is_select: 1 } });
                    // for (let i = 0; i < address.length; i++) {
                    if (address) {
                        address.is_select = 0;
                        await address.save();
                    }
                    // }
                }

                // save updated address.
                await address.save();

                return res.status(200).json({
                    message: 'Address updated successfully..',
                    data: address
                });

            }
            catch (err) {
                const error = new Error('Address not updated!');
                error.statusCode = 404;
                throw error;
            }

        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


/*
 * Delete address for every user.
*/
exports.deleteAddress = (req, res, next) => {

    // Find address through address id.
    Address.findOne({ where: { id: req.params.id } })
        .then(async address => {

            // Check whether address is exist or not.
            if (address === null) {
                return res.status(404).json({ErrorMessage : "Address not found!",status:0})
            }

            // Detele address into database.
            try {

                await address.destroy();

                return res.status(200).json({
                    message: 'Address deleted successfully!',
                    status: 1
                });
            }
            catch (err) {
                const error = new Error('Address not deleted!\n' + err);
                error.statusCode = 400;
                throw error;
            }

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}


/*
 * Get all addresses for every user.
*/
exports.getAddress = (req, res, next) => {

    // // Find address through user id.
    Address.findAll({ where: { userId: req.user_id } })
        .then(addresses => {

            // Check whether addresses are exist or not.
            if (addresses.length === 0) {
                const error = new Error('Addresses not found!');
                error.statusCode = 404;
                throw error;
            }

            // Send all saved address of user.
            return res.status(200).json({
                message: 'Address Fetched successfully!',
                data: addresses
            });

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}


