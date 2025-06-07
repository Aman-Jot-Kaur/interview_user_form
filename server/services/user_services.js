const {add_user,get_user_by_uuid,update_user,delete_user}=require("../repositories/users_repository")
const { no_content, not_found,bad_request } = require("../libs/error");
const { error_handler } = require("../libs/utils");
exports.add_user = async (payload) => {
    const { role,email,password} = payload.data;
    const user={role,email,password}
    const response = await add_user(user);
    return response;
  };
exports.get_user= async (payload) => {
  const {user_id } = payload?.params || {};
  const user = await get_user_by_uuid(user_id);
  if (!user) throw new not_found("User not found");
  return user;
}
exports.update_user= async (payload) => {
  const {user_id } = payload?.params || {};
  const response = await update_user(user_id,payload.data);
  if (!response) throw new not_found("User not found");
  return response;
}
exports.delete_user= async (payload) => {
  const {user_id } = payload?.params || {};
  const user = await delete_user(user_id);
  if (!user) throw new not_found("User not found");
  return { message: "User deleted successfully" };
}
