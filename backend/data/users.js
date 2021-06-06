import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'admin',
        email: 'admin@test.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmin: true,
    },
    {
        name: 'client',
        email: 'client@test.com',
        password: bcrypt.hashSync('12345', 10),
    },
    {
        name: 'agent',
        email: 'agent@test.com',
        password: bcrypt.hashSync('12345', 10),
    },
]

export default users