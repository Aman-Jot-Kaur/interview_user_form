const { no_content, not_found } = require("../libs/error");
const { error_handler } = require("../libs/utils");
const {add_user,get_user,update_user,delete_user}=require("../services/user_services")

exports.add_user=async(req,res)=>{
    try {
      
        const response = await add_user({ data: req.body });
        if (!response) throw new Error("User could not be created.");
        return res.status(201).json({response});
      } catch (error) {
        res.status(error_handler(error)).json({ error: error.message });
      }
}

exports.get_user_by_uuid = async (req, res) => {
  try {
    const response = await get_user({ params: req.params });
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
