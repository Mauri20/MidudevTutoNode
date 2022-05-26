const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
});
//FORMATEO DE COMO EJECUTARA EL TOJSON
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Note = model("Note", noteSchema);
// Note.find({}).then((result) => {
//   console.log(result);
// });
module.exports = Note;

// const note = new Note({
//   content: "Nota a la DB",
//   date: new Date(),
//   important: true,
// });
// note
//   .save()
//   .then((result) => {
//     console.log(result);
//     mongoose.connection.close();
//   })
//   .catch((err) => {
//     console.log(err);
//   });
