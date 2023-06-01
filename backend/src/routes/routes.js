const router = require('express').Router();

router.get('/api', (req, res) => {
    res.json({ 'Desafio PUMA - Backend' : 'Funcionando' });
});

module.exports = router;