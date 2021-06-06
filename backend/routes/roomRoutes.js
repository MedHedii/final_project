import express from 'express'
const router = express.Router()
import { getRoomById, getRooms,  deleteRoom,
    createRoom,
    updateRoom,
    createRoomReview,
    getTopRooms, } from '../controllers/roomController.js'
    import { protect, admin } from '../middleware/authMiddleware.js'

    router.route('/').get(getRooms).post(protect, admin, createRoom)
    router.route('/:id/reviews').post(protect, createRoomReview)
    router.get('/top', getTopRooms)
    router
      .route('/:id')
      .get(getRoomById)
      .delete(protect, admin, deleteRoom)
      .put(protect, admin, updateRoom)
    
    export default router