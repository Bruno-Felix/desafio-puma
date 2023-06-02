const router = require('express').Router();

const userController = require('../controllers/userController');

router.get('/', (req, res) => {
    res.json({ 'Desafio PUMA - Backend' : 'Funcionando' });
});

router.post('/users', userController.addUser);
router.get('/users', userController.listUsers);
router.delete('/users/:username', userController.removeUser);

module.exports = router;