module.exports = (req, res) => {
    res.status(200).json({
        name: process.env.LEGALNAME,
        address: process.env.LEGALADDRESS
    });
}