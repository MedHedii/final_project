import asyncHandler from 'express-async-handler'
import Room from '../models/roomModel.js'

//     Fetch all rooms

const getRooms = asyncHandler(async (req, res) => {
    const pageSize = 12
    const page = Number(req.query.pageNumber) || 1
  
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {}
  
    const count = await Room.countDocuments({ ...keyword })
    const rooms = await Room.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
  
    res.json({ rooms, page, pages: Math.ceil(count / pageSize) })
  })
  
  //     Fetch single room
  
  const getRoomById = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id)
  
    if (room) {
      res.json(room)
    } else {
      res.status(404)
      throw new Error('Room not found')
    }
  })
  
  //     Delete a room
  
  const deleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id)
  
    if (room) {
      await room.remove()
      res.json({ message: 'Room removed' })
    } else {
      res.status(404)
      throw new Error('Room not found')
    }
  })
  
  //    Create a room
  
  const createRoom = asyncHandler(async (req, res) => {
    const room = new Room({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      capacity: 'Sample capacity',
      category: 'Sample category',
      countInStock: 30,
      numReviews: 0,
      description: 'Sample description',
    })
  
    const createdRoom = await room.save()
    res.status(201).json(createdRoom)
  })
  
  //     Update a room
  
  const updateRoom = asyncHandler(async (req, res) => {
    const {
      name,
      price,
      description,
      image,
      capacity,
      category,
      countInStock,
    } = req.body
  
    const room = await Room.findById(req.params.id)
  
    if (room) {
      room.name = name
      room.price = price
      room.description = description
      room.image = image
      room.capacity = capacity
      room.category = category
      room.countInStock = countInStock
  
      const updatedRoom = await room.save()
      res.json(updatedRoom)
    } else {
      res.status(404)
      throw new Error('Room not found')
    }
  })
  
  //    Create new review
  
  const createRoomReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
  
    const room = await Room.findById(req.params.id)
  
    if (room) {
      const alreadyReviewed = room.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      )
  
      if (alreadyReviewed) {
        res.status(400)
        throw new Error('Room already reviewed')
      }
  
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      }
  
      room.reviews.push(review)
  
      room.numReviews = room.reviews.length
  
      room.rating =
        room.reviews.reduce((acc, item) => item.rating + acc, 0) /
        room.reviews.length
  
      await room.save()
      res.status(201).json({ message: 'Review added' })
    } else {
      res.status(404)
      throw new Error('Room not found')
    }
  })
  
  //     Get top rated rooms
  
  const getTopRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find({}).sort({ rating: -1 }).limit(3)
  
    res.json(rooms)
  })
  
  export {
    getRooms,
    getRoomById,
    deleteRoom,
    createRoom,
    updateRoom,
    createRoomReview,
    getTopRooms,
  }