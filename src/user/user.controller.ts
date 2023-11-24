import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { userValidationSchema } from "./user.joi.validation";


const addProductToOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orderData = req.body;

    // Validate order data using Joi (you can create a separate validation schema)
    // ...

    const result = await UserServices.addProductToOrder(userId, orderData);

    res.status(200).json({
      success: true,
      message: 'Product added to order successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};


const createUser = async (req: Request, res: Response) => {
    try {
      // const { user: userData } = req.body;
     
      const {error, value} = userValidationSchema.validate(req.body);
      // if (error) {
      //   // If validation fails, return an error response with the details
      //   res.status(400).json({
      //     success: false,
      //     message: 'Validation error',
      //     error: error.details[0].message,
      //   });
      //   return;
      // }
      const result = await UserServices.createUserIntoDB(value);
  
      res.status(200).json({
        success: true,
        message: 'User is created successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'something went wrong',
        error: err,
      });
    }
  };

  const getAllUsers = async (req: Request, res: Response) => {
    try {
      const result = await UserServices.getAllUsersFromDB();
  
      res.status(200).json({
        success: true,
        message: 'Users are retrieved successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'something went wrong',
        error: err,
      });
    }
  };


  const getSingleUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
  
      const result = await UserServices.getSingleUserFromDB(userId);
  
      res.status(200).json({
        success: true,
        message: 'User is retrieved successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'something went wrong',
        error: err,
      });
    }
  };
  

  const updateUserInformation = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const updatedUserData = req.body;
  
      // Validate updated user data using Joi (you can create a separate validation schema)
      const { error: validationError, value } = userValidationSchema.validate(updatedUserData);
  
      if (validationError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          error: validationError.details[0].message,
        });
        return;
      }
  
      const result = await UserServices.updateUserInformation(userId, value);
  
      res.status(200).json({
        success: true,
        message: 'User information updated successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong',
        error: err,
      });
    }
  };


  const deleteUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
  
      const result = await UserServices.deleteUserFromDB(userId);
  
      res.status(200).json({
        success: true,
        message: 'User is deleted successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'something went wrong',
        error: err,
      });
    }
  };
  const getAllOrdersForUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
  
      const result = await UserServices.getAllOrdersForUser(userId);
  
      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong',
        error: err,
      });
    }
  }; 

  const calculateTotalPriceForUserOrders = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
  
      const result = await UserServices.calculateTotalPriceForUserOrders(userId);
  
      res.status(200).json({
        success: true,
        message: 'Total price calculated successfully!',
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong',
        error: err,
      });
    }
  };
  export const UserControllers = {
    createUser,
    getAllUsers,
    getSingleUser,
    deleteUser,
    addProductToOrder,
    updateUserInformation,
    getAllOrdersForUser,
    calculateTotalPriceForUserOrders
  };
  