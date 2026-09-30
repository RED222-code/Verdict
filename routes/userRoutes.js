const express = require('express');
const { getUsers, getUser, updateUser, deleteUser, signup, login } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.use(protect);
router.use(restrictTo('admin'));

router.route('/').get(getUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
