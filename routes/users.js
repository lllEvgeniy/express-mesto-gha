const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUser, getUserById, updateAvatar, updateUser, currentUser, createUser, login,
} = require('../controllers/users');

router.use(auth);
router.get('/', getUser);

router.get('/me', currentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

router.get('/:userId', getUserById);

module.exports = router;
