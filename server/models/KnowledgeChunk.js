const mongoose = require('mongoose');

const knowledgeChunkSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  metadata: {
    pageNumber: Number,
    category: String,
    sourceTitle: String
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('KnowledgeChunk', knowledgeChunkSchema);
