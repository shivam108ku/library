const isOwner = (req, res, next) => {
    try {
        const {role} = req.payload;

        if(role != "owner")
            throw new Error("Not an owner");

        next();
    } catch(error) {
        console.error(error);
        res.status(401).json({
            status: "failed",
            message: error.message
        }); 
    }
}

module.exports = isOwner;