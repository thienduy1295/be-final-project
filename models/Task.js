const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = Schema(
  {
    name: { type: String, require: true },
    detail: { type: String, require: true },
    status: {
      type: String,
      require: true,
      enum: ["todo", "review", "done"],
      default: "todo",
    },
    duedate: { type: Date, require: true },
    assigner: { type: Schema.Types.ObjectId, ref: "Users", require: true },
    assignee: { type: Schema.Types.ObjectId, ref: "Users", require: true },

    // team: { type: String },
    //add object id library
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Tasks", taskSchema);
module.exports = Task;
