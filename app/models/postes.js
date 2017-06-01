'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = mongoose.Schema({

    p_title: String,
    p_head: String,
    p_contet: String ,
    p_postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    p_postDate: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema,'posts')
