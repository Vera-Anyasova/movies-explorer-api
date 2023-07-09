const router = require("express").Router();
const { profileValidation } = require("../middlewares/validation");

const { updateProfile, getCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);

router.patch("/me", profileValidation, updateProfile);

module.exports = router;
