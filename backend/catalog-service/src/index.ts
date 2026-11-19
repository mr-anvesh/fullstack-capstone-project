import express from 'express';
import { addListingController } from './controllers/addListing.controller';
import { deleteListingController } from './controllers/deleteListing.controller';
import { getListingByUserController } from './controllers/getListingByUser.controller';
import { listingByIdController } from './controllers/listingById.controller';
import { listingsByLocationController } from './controllers/listingsByLocation.controller';
import { updateListingController } from './controllers/updateListing.controller';
import { connectRedis } from './config/redis';

const app = express();
const router = express.Router();

app.use(express.json());

router.post('/listings', addListingController);
router.get('/listings', listingsByLocationController);
router.get('/listings/user', getListingByUserController);
router.post('/listings/getdetails', listingByIdController);
router.patch('/listings/update', updateListingController);
router.post('/listings/delete', deleteListingController);

app.use(router);

void connectRedis().catch((err) => {
    console.error('Error connecting to Redis:', err);
});

app.listen(process.env.PORT || 4003);
