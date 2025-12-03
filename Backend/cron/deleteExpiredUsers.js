import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const deleteExpiredUsers = async () => {
  const now = new Date();

  const users = await User.find({
    deleteRequested: true,
    deleteAt: { $lte: now },
  });

  for (const user of users) {
    await Product.deleteMany({ seller: user._id });

    await Order.updateMany(
      { buyer: user._id },
      { $set: { buyer: null } }
    );

    await user.deleteOne();
  }

  console.log(`${users.length} expired users deleted.`);
};
