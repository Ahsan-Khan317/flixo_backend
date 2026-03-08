import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_super_secret_jwt_key_change_this_in_production';
const JWT_EXPIRE = '7d';

export const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

export default generateToken;