import express from 'express';
import { addListingController } from './controllers/addListing.controller';
import { deleteListingController } from './controllers/deleteListing.controller';
import { getListingByUserController } from './controllers/getListingByUser.controller';
import { listingByIdController } from './controllers/listingById.controller';
import { listingsByLocationController } from './controllers/listingsByLocation.controller';
import { updateListingController } from './controllers/updateListing.controller';

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

app.listen(process.env.PORT || 4003);
