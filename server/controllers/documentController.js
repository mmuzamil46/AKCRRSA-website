const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');

const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find().sort({ createdAt: -1 });
  res.json(documents);
});

const createDocument = asyncHandler(async (req, res) => {
  const { title, description, fileUrl, category } = req.body;
  const document = await Document.create({ title, description, fileUrl, category });
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
    document.title = title;
    document.description = description;
    document.fileUrl = fileUrl;
    document.category = category;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

module.exports = { getDocuments, createDocument, deleteDocument, updateDocument };
