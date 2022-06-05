const mongoose = require('mongoose');

const Schema = mongoose.Schema;
 const category = new Schema({
     parentId: { type: mongoose.Types.ObjectId, required: true, ref: 'NewCategory'},
     category_name: {type: String},
     level: {type: Number},
     target_sale: { type: Number},
     current_sale: { type: Number},
     progress_persent: { type: Number},
     bar_colour: { type: String, enum:[ 'Red', 'Yellow', 'Green'] },
     progress_label: { type: String, enum:[ 'At risk', 'off track', 'on track'] },
     child_nodes: [{ type: mongoose.Types.ObjectId, required: true, ref:'NewCategory'}]  
 });

 module.exports = mongoose.model('NewCategory', category);