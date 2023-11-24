import express from 'express';
import { UserControllers } from './user.controller';



const router = express.Router();

router.get('/', UserControllers.getAllUsers);

router.post('/', UserControllers.createUser);

router.get('/:userId', UserControllers.getSingleUser);

router.delete('/:userId', UserControllers.deleteUser);

router.put('/:userId', UserControllers.updateUserInformation);

router.get('/:userId/orders', UserControllers.getAllOrdersForUser);

router.put('/:userId/orders', UserControllers.addProductToOrder);

router.get('/:userId/orders/total-price', UserControllers.calculateTotalPriceForUserOrders);


export const UserRoutes = router;
