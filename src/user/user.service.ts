
import { Order, User } from "./user.interface";
import { userValidationSchema } from "./user.joi.validation";
import UserModel from "./user.model";

 
interface CustomError {
  code: number;
  description: string;
  message?: string;
}


const addProductToOrder = async (userId: string, orderData: Order) => {
  try {
    const user = await UserModel.findOne({ userId });

    if (!user) {
      const error: CustomError = { code: 404, description: 'User not found!' };
      throw error;
    }

    // Check if 'orders' property exists, if not, create it
    if (!user.orders) {
      user.orders = [];
    }

    // Append the new product to the 'orders' array
    user.orders.push(orderData);

    // Save the updated user object
    await user.save();

    return user.orders; // Return the updated 'orders' array
  } catch (error) {
    // Cast the error to CustomError to resolve the 'unknown' type issue
    const customError = error as CustomError;

    if (customError.code === 404) {
      throw customError;
    }

    throw new Error(customError.message || 'Failed to add product to order');
  }
};

const createUserIntoDB = async (userData: User) => {
//   if (await UserModel.isUserExists(userData.id)) {
//     throw new Error('User already exists!');
//   }
  const result = await UserModel.create(userData);
  const { password, ...userDataWithoutPassword } = result.toObject()
  return userDataWithoutPassword;
};

const getAllUsersFromDB = async () => {
  const users = await UserModel.find();
    // Map the results to ensure consistent response format
    const filteredUsers = users.map((user) => ({
      username: user.username,
      fullName: user.fullName,
      age: user.age,
      email: user.email,
      address: user.address,
    }));

    return filteredUsers;
 
};

const getSingleUserFromDB = async (id: string) => {
  const user = await UserModel.findOne({ userId: id }, '-password');
//   const result = await UserModel.aggregate([{ $match: { id } }]);
if (!user) {
  throw { code: 404, description: 'User not found!' };
}

// Exclude the password field from the response data
const { password, ...userDataWithoutPassword } = user.toObject();

return userDataWithoutPassword;
};


const updateUserInformation = async (userId: string, updatedUserData: User) => {
  try {
    const user = await UserModel.findOne({ userId });

    if (!user) {
      const error: CustomError = { code: 404, description: 'User not found!' };
      throw error;
    }

    // Validate updated user data using Joi
    const { error: validationError, value } = userValidationSchema.validate(updatedUserData);

    if (validationError) {
      const error: CustomError = { code: 400, description: 'Validation error', message: validationError.details[0].message };
      throw error;
    }

    // Update user information
    user.set(value);
    await user.save();

    // Ensure password is not included in the response data
    const updatedUser = user.toObject();
    // delete updatedUser?.password;

    return updatedUser;
  } catch (error) {
    const customError = error as CustomError;

    if (customError.code === 404 || customError.code === 400) {
      throw customError;
    }

    throw new Error(customError.message || 'Failed to update user information');
  }
};
const deleteUserFromDB = async (id: string) => {
  const result = await UserModel.updateOne({ id }, { isDeleted: true });
  return result;
};
const getAllOrdersForUser = async (userId: string) => {
  try {
    const user = await UserModel.findOne({ userId });

    if (!user) {
      const error: CustomError = { code: 404, description: 'User not found!' };
      throw error;
    }

    // Return the 'orders' array or an empty array if it doesn't exist
    return user.orders || [];
  } catch (error) {
    const customError = error as CustomError;

    if (customError.code === 404) {
      throw customError;
    }

    throw new Error(customError.message || 'Failed to retrieve orders for the user');
  }
};

const calculateTotalPriceForUserOrders = async (userId: string) => {
  try {
    const user = await UserModel.findOne({ userId });

    if (!user) {
      const error: CustomError = { code: 404, description: 'User not found!' };
      throw error;
    }

    // Calculate total price of orders
    const totalPrice = user.orders?.reduce((sum, order) => sum + order.price * order.quantity, 0) || 0;

    return { totalPrice };
  } catch (error) {
    const customError = error as CustomError;

    if (customError.code === 404) {
      throw customError;
    }

    throw new Error(customError.message || 'Failed to calculate total price for user orders');
  }
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  addProductToOrder,
  updateUserInformation,
  getAllOrdersForUser,
  calculateTotalPriceForUserOrders
};
