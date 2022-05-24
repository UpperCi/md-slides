const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let presentationSchema = new Schema(
   {
      title: { type: String, required: true },
      content: { type: String, required: true },
      desc: { type: String, required: true },
      author: { type: String, required: true },
      _links: { type: Object, required: true }
   }
);

const Presentation = mongoose.model('Presentation', presentationSchema);
// Presentation.save(function (error) {
//    error = Presentation.validateSync();
// });

module.exports = Presentation;
