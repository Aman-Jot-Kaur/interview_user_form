const users_model = require("../models/users_model");
const { base_repository } = require("./base_repository");

class users_repository extends base_repository {
  constructor(payload) {
    super(payload);
  }

  //  Add a new user
  async add_user(payload) {
    return await this.create(payload);
  }

  //  Get a single user by uuid (soft delete check)
  async get_user_by_uuid(user_id) {
    const criteria = { uuid: user_id, deleted_at: null };
    return await this.find_one(criteria);
  }

  //  Update a user by uuid
  async update_user(user_id, payload) {
    const criteria = { uuid: user_id, deleted_at: null };
    const update = { $set: {} };

    if (payload?.role) update.$set.role = payload.role;
    if (payload?.password) update.$set.password = payload.password;
    if (payload?.email) update.$set.email = payload.email;
      if (payload?.image1) update.$set.image1 = payload.image1;
  if (payload?.image2) update.$set.image2 = payload.image2;
  if (payload?.video) update.$set.video = payload.video;

    return await this.update_one(criteria, update, {
      runValidators: true
    });
  }

  // 🟠 Soft delete a user by uuid
  async delete_user(user_id) {
    const criteria = { uuid: user_id, deleted_at: null };
    const update = { $set: { deleted_at: new Date() } };
    return await this.update_one(criteria, update);
  }
}

module.exports = {
  add_user: async (payload) => await new users_repository({ model: users_model }).add_user(payload),
  get_user_by_uuid: async (id) => await new users_repository({ model: users_model }).get_user_by_uuid(id),
  update_user: async (id, payload) => await new users_repository({ model: users_model }).update_user(id, payload),
  delete_user: async (id) => await new users_repository({ model: users_model }).delete_user(id),
};
module.exports = {
  users_repository: new users_repository({ model: users_model }),
};