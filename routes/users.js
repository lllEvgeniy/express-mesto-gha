const router = require('express').Router();
const { createUser, getUser, getUserById, updateAvatar, updateUser, } = require('../controllers/users');

router.get('/', getUser);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;