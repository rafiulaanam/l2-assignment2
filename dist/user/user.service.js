"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_joi_validation_1 = require("./user.joi.validation");
const user_model_1 = __importDefault(require("./user.model"));
const addProductToOrder = (userId, orderData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ userId });
        if (!user) {
            const error = { code: 404, description: 'User not found!' };
            throw error;
        }
        // Check if 'orders' property exists, if not, create it
        if (!user.orders) {
            user.orders = [];
        }
        // Append the new product to the 'orders' array
        user.orders.push(orderData);
        // Save the updated user object
        yield user.save();
        return user.orders; // Return the updated 'orders' array
    }
    catch (error) {
        // Cast the error to CustomError to resolve the 'unknown' type issue
        const customError = error;
        if (customError.code === 404) {
            throw customError;
        }
        throw new Error(customError.message || 'Failed to add product to order');
    }
});
const createUserIntoDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    //   if (await UserModel.isUserExists(userData.id)) {
    //     throw new Error('User already exists!');
    //   }
    const result = yield user_model_1.default.create(userData);
    const _a = result.toObject(), { password } = _a, userDataWithoutPassword = __rest(_a, ["password"]);
    return userDataWithoutPassword;
});
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find();
    // Map the results to ensure consistent response format
    const filteredUsers = users.map((user) => ({
        username: user.username,
        fullName: user.fullName,
        age: user.age,
        email: user.email,
        address: user.address,
    }));
    return filteredUsers;
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ userId: id }, '-password');
    //   const result = await UserModel.aggregate([{ $match: { id } }]);
    if (!user) {
        throw { code: 404, description: 'User not found!' };
    }
    // Exclude the password field from the response data
    const _b = user.toObject(), { password } = _b, userDataWithoutPassword = __rest(_b, ["password"]);
    return userDataWithoutPassword;
});
const updateUserInformation = (userId, updatedUserData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ userId });
        if (!user) {
            const error = { code: 404, description: 'User not found!' };
            throw error;
        }
        // Validate updated user data using Joi
        const { error: validationError, value } = user_joi_validation_1.userValidationSchema.validate(updatedUserData);
        if (validationError) {
            const error = { code: 400, description: 'Validation error', message: validationError.details[0].message };
            throw error;
        }
        // Update user information
        user.set(value);
        yield user.save();
        // Ensure password is not included in the response data
        const updatedUser = user.toObject();
        // delete updatedUser?.password;
        return updatedUser;
    }
    catch (error) {
        const customError = error;
        if (customError.code === 404 || customError.code === 400) {
            throw customError;
        }
        throw new Error(customError.message || 'Failed to update user information');
    }
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.updateOne({ id }, { isDeleted: true });
    return result;
});
const getAllOrdersForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ userId });
        if (!user) {
            const error = { code: 404, description: 'User not found!' };
            throw error;
        }
        // Return the 'orders' array or an empty array if it doesn't exist
        return user.orders || [];
    }
    catch (error) {
        const customError = error;
        if (customError.code === 404) {
            throw customError;
        }
        throw new Error(customError.message || 'Failed to retrieve orders for the user');
    }
});
const calculateTotalPriceForUserOrders = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const user = yield user_model_1.default.findOne({ userId });
        if (!user) {
            const error = { code: 404, description: 'User not found!' };
            throw error;
        }
        // Calculate total price of orders
        const totalPrice = ((_c = user.orders) === null || _c === void 0 ? void 0 : _c.reduce((sum, order) => sum + order.price * order.quantity, 0)) || 0;
        return { totalPrice };
    }
    catch (error) {
        const customError = error;
        if (customError.code === 404) {
            throw customError;
        }
        throw new Error(customError.message || 'Failed to calculate total price for user orders');
    }
});
exports.UserServices = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    addProductToOrder,
    updateUserInformation,
    getAllOrdersForUser,
    calculateTotalPriceForUserOrders
};
