import mongoose from 'mongoose'
import dotenv from 'dotenv'
import users from './data/users.js'
import rooms from './data/rooms.js'
import User from './models/userModel.js'
import Room from './models/roomModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
    try {
        await Order.deleteMany()
        await Room.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)

        const adminUser = createdUsers[0]._id

        const sampleRoom = rooms.map(room => {
            return { ...room, user:adminUser }
        })
        await Room.insertMany(sampleRoom)
        
        console.log('Data Imported')
        process.exit()
} catch(error){
        console.error(`${error}`)
        process.exit(1)
}
}

const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Room.deleteMany()
        await User.deleteMany()
        
        console.log('Data Destroyed')
        process.exit()
} catch(error){
        console.error(`${error}`)
        process.exit(1)
}
}

if (process.argv[2] === '-d'){
    destroyData()
} else {
    importData()
}
