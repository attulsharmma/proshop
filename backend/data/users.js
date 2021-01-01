import bcrypt from 'bcryptjs';
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('test1234', 10),
    isAdmin: true,
  },
  {
    name: 'Atul Sharma',
    email: 'atul@example.com',
    password: bcrypt.hashSync('test1234', 10),
  },
  {
    name: 'Jane Saxena',
    email: 'jane@example.com',
    password: bcrypt.hashSync('test1234', 10),
  },
];

export default users;
