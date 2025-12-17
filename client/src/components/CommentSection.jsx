import React, { useState, useEffect } from 'react';
import { RiUser3Fill } from 'react-icons/ri';
import axios from 'axios';

const CommentSection = ({ serviceId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if(!serviceId) return;

    const fetchComments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/comments/service/${serviceId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments", err);
      }
    };

    fetchComments();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment || !name || !serviceId) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/comments`, {
        serviceId,
        user: name,
        content: newComment,
        rating
      });
      setNewComment('');
      setName('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Error submitting comment');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-8 border border-gray-100">
      <h3 className="text-2xl font-serif font-bold text-primary mb-6">የተገልጋዮች አስተያየት ({comments.length})</h3>

      <div className="space-y-6 mb-8">
        {comments.length === 0 ? (
           <p className="text-gray-500 text-sm italic">አስተያየት የለም። የመጀመሪያውን አስተያየት ይስጡ!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <RiUser3Fill />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-primary">{comment.user}</h4>
                  <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex text-yellow-400 text-sm mb-2">
                  {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                </div>
                <p className="text-gray-600 text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-bold text-lg mb-4 text-primary">አስተያየት ይስጡ</h4>
        {submitted ? (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm border border-green-200">
                አስተያየትዎ ተልኳል! ከአስተዳዳሪ ማረጋገጫ በኋላ በገጹ ላይ ይወጣል።
            </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="ሙሉ ስም"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:outline-none"
            required
          />
          <select 
            value={rating} 
            onChange={e => setRating(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:outline-none"
          >
            <option value="5">★★★★★ (በጣም ጥሩ)</option>
            <option value="4">★★★★ (ጥሩ)</option>
            <option value="3">★★★ (መካከለኛ)</option>
            <option value="2">★★ (ደካማ)</option>
            <option value="1">★ (በጣም ደካማ)</option>
          </select>
        </div>
        <textarea
          placeholder="አስተያየትዎን እዚህ ይጻፉ..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded h-32 mb-4 focus:border-primary focus:outline-none resize-none"
          required
        ></textarea>
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition-colors font-bold">
          አስተያየት ይላኩ
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
