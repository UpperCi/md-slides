const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let presentationModel = new Schema(
   {
      title: { type: String, required: true },
      content: { type: String, required: true  },
      desc: { type: String, required: true  },
      author: { type: String, required: true  },
      _links: { type: Object, required: true }
   }
);

// presentationModel.virtual('_links').get(() => {
//    return {
//       'self' : "sdada"
//    }
// })

module.exports = mongoose.model('Presentation', presentationModel);
