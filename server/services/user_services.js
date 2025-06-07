const { add_user, get_user_by_uuid, update_user, delete_user,  get_users_by_date } = require("../repositories/users_repository");
const { no_content, not_found, bad_request } = require("../libs/error");
const { error_handler } = require("../libs/utils");

exports.add_user = async (payload) => {
    console.log(payload)
  const { name, age, address , date,  videoPath,
    image1Path,
    image2Path,} = payload?.data || {}; // ✅ safe destructuring
  if (!name || !age || !address || !date) {
    throw new bad_request("All fields (name, age, address) are required",payload?.data);
  }
  
  const user = {
    name,
    age,
    address,
    date,
    video: videoPath || null,
    image1: image1Path || null,
    image2: image2Path || null,
  };
  const response = await add_user(user);
  return response;
};


exports.get_user_by_uuid = async (payload) => {
  const { user_id } = payload?.params || {};
  const user = await get_user_by_uuid(user_id);
  if (!user) throw new not_found("User not found");
  return user;
};

exports.update_user = async (payload) => {
  const { user_id } = payload?.params || {};
  const response = await update_user(user_id, payload.data);
  if (!response) throw new not_found("User not found");
  return response;
};

exports.delete_user = async (payload) => {
  const { user_id } = payload?.params || {};
  const user = await delete_user(user_id);
  if (!user) throw new not_found("User not found");
  return { message: "User deleted successfully" };
};
exports.get_users_by_date = async (payload) => {
  const { date } = payload?.params || {};
  if (!date) throw new bad_request("Date parameter is required");

  const users = await get_users_by_date(date);
  return users;
};
