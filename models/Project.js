const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = Schema(
  {
    name: { type: String, require: true },
    detail: { type: String, require: true },

    tasks: [{ type: Schema.Types.ObjectId, ref: "Tasks" }],

    status: {
      type: String,
      require: true,
      enum: ["todo", "review", "done", "archive"],
      default: "todo",
    },
    duedate: { type: Date, require: true },
    assigner: { type: Schema.Types.ObjectId, ref: "Users", require: true },
    assignees: [{ type: Schema.Types.ObjectId, ref: "Users", require: true }],
    // project:{type:String,required:true},
    // team: { type: String },
    //add object id library
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Projects", projectSchema);
module.exports = Project;
