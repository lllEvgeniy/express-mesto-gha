const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  createUser, getUser, getUserById, updateAvatar, updateUser, login, currentUser,
} = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);
router.get('/', getUser);
router.get('/me', currentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

router.get('/:userId', getUserById);

module.exports = router;
