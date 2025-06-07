const { no_content, not_found } = require("../libs/error");
const { error_handler } = require("../libs/utils");
const { upload } = require("../libs/constants.js");
const {add_user,get_user_by_uuid,update_user,delete_user,get_users_by_date}=require("../services/user_services")


const uploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
]);

exports.add_user = async (req, res) => {
  // Manually call multer middleware inside controller
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      // Extract file paths safely
      const videoPath = req.files?.video ? req.files.video[0].path : null;
      const image1Path = req.files?.image1 ? req.files.image1[0].path : null;
      const image2Path = req.files?.image2 ? req.files.image2[0].path : null;

      // Combine req.body and file paths
      const data = {
        ...req.body,
        videoPath,
        image1Path,
        image2Path,
      };

      const response = await add_user({ data });

      if (!response) throw new Error("User could not be created.");

      return res.status(201).json({ response });
    } catch (error) {
      return res.status(error_handler(error)).json({ error: error.message });
    }
  });
};

exports.get_user_by_uuid = async (req, res) => {
  try {
    const response = await get_user_by_uuid({ params: req.params });
    if (!response) throw new not_found("User could not be found.");
    return res.status(200).json(response);
  } catch (error) {
    res.status(error_handler(error)).json({ error: error.message });
  }
}

exports.update_user = async (req, res) => {
  try {
    const response = await update_user({ params:req.params,data: req.body });
    if (!response) throw new Error('User could not be updated.');
    res.status(200).json(response);
  } catch (error) {
    res.status(error_handler(error)).json({ error: error.message });
  }
}

exports.delete_user=async(req,res)=>{
  try {
    const response = await delete_user({ params: req.params });
    if (!response) throw new Error("User could not be deleted.");
    return res.status(200).json(response);
  } catch (error) {
    res.status(error_handler(error)).json({ error: error.message });
  }
}
exports.get_users_by_date = async (req, res) => {
  try {
    const response = await get_users_by_date({ params: req.params });
    return res.status(200).json(response);
  } catch (error) {
    res.status(error_handler(error)).json({ error: error.message });
  }
};