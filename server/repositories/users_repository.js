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

    if (payload?.data?.name) update.$set.name = payload.name;
    if (payload?.data?.address) update.$set.address = payload.address;
    if (payload?.data?.age) update.$set.age = payload.age;
      if (payload?.data?.image1) update.$set.image1 = payload.image1;
  if (payload?.data?.image2) update.$set.image2 = payload.image2;
  if (payload?.data?.video) update.$set.video = payload.video;

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

// Add this method inside users_repository class
async get_users_by_date(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const criteria = {
    date: { $gte: start, $lte: end },
    deleted_at: null
  };

  return await this.find_all(criteria);
}
}
const repo = new users_repository({ model: users_model });

module.exports = {
  add_user: repo.add_user.bind(repo),
  get_user_by_uuid: repo.get_user_by_uuid.bind(repo),
  update_user: repo.update_user.bind(repo),
  delete_user: repo.delete_user.bind(repo),
  get_users_by_date: repo.get_users_by_date.bind(repo), // if needed
};