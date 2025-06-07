const router = require("express").Router();
const {
  get_user_by_uuid,
  add_user,
  update_user,
  delete_user,
  get_users_by_date
} = require("../controllers/user_controller");

const { limiter } = require("../libs/constants");

router.get("/", (req,res)=>{
res.send("please select date to get users")
});
router.get("/:user_id", get_user_by_uuid);
router.post("/", limiter, add_user);
router.patch("/:user_id", update_user);
router.delete("/:user_id", delete_user);


router.get("/date/:date", get_users_by_date); 

module.exports = router;
