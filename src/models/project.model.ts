import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

projectSchema.post("findOneAndDelete", async (doc, next) => {
  if (!doc) return next(null);

  const projectId = doc._id;

  try {
    const tasks = await mongoose.model("Task").find({
      project: projectId,
    });

    const taskIds = tasks.map((task) => task._id);

    const deleteSubtasks = async () => {
      await mongoose.model("Subtask").deleteMany({
        task: { $in: taskIds },
      });
    };

    const deleteTask = async () => {
      await mongoose.model("Task").deleteMany({
        project: projectId,
      });
    };

    const deleteProjectMembers = async () => {
      await mongoose.model("ProjectMember").deleteMany({
        project: projectId,
      });
    };

    const deleteNotes = async () => {
      await mongoose.model("Note").deleteMany({
        project: projectId,
      });
    };

    await Promise.all([
      deleteSubtasks(),
      deleteTask(),
      deleteProjectMembers(),
      deleteNotes(),
    ]);

    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Project = mongoose.model("Project", projectSchema);
