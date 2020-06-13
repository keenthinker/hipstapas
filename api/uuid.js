module.exports = (req, res) => {
    const { v4: uuidv4 } = require('uuid');
    res.status(200).send(uuidv4());
}