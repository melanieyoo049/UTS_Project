const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { JWT_SECRET } = require('../middlewares_helpers/authMiddleware');

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, username, email, dan password wajib diisi.' });
    }

    const existingUser = await userModel.findByEmailOrUsername(email);
    const existingUsername = await userModel.findByEmailOrUsername(username);

    if (existingUser || existingUsername) {
      return res.status(409).json({ success: false, message: 'Username atau email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: 'member'
    });

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil. Silakan masuk.',
      data: { id: result.lastID, name, username, email, role: 'member' }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Username/Email dan password wajib diisi.' });
    }

    const user = await userModel.findByEmailOrUsername(identifier);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Akun tidak ditemukan atau password salah.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Akun tidak ditemukan atau password salah.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Berhasil masuk.',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
