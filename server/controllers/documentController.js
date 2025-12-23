const Document = require('../models/Document');
const { indexDocument } = require('../utils/documentProcessor');

const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find().sort({ createdAt: -1 });
  res.json(documents);
});

const createDocument = asyncHandler(async (req, res) => {
  const { title, description, fileUrl, category } = req.body;
  const document = await Document.create({ title, description, fileUrl, category });
  
  // Index in background
  indexDocument(document);

  res.status(201).json(document);
});

const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (document) {
    await document.deleteOne();
    res.json({ message: 'Document removed' });
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

const updateDocument = asyncHandler(async (req, res) => {
  const { title, description, fileUrl, category } = req.body;
  const document = await Document.findById(req.params.id);

  if (document) {
    const isUrlChanged = document.fileUrl !== fileUrl;
    document.title = title;
    document.description = description;
    document.fileUrl = fileUrl;
    document.category = category;

    const updatedDocument = await document.save();
    
    // Re-index if URL changed
    if (isUrlChanged) {
      indexDocument(updatedDocument);
    }

    res.json(updatedDocument);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

const reindexAll = asyncHandler(async (req, res) => {
  const documents = await Document.find();
  for (const doc of documents) {
    indexDocument(doc);
  }
  res.json({ message: 'Indexing started for all documents' });
});

module.exports = { getDocuments, createDocument, deleteDocument, updateDocument, reindexAll };
