const isAdmin = (req, res, next) => {
    try {
        const {role} = req.payload;

        if(role != "owner" && role != "manager")
            throw new Error("Not an admin");

        next();
    } catch(error) {
        console.error(error);
        res.status(401).json({
            status: "failed",
            message: error.message
        });
    }
}

module.exports = isAdmin;