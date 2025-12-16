import React from 'react';
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri';

const AdminTable = ({ columns, data, onEdit, onDelete, imageColumn }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((col, idx) => (
              <th key={idx} className="p-4 font-bold text-gray-600">{col.header}</th>
            ))}
            <th className="p-4 font-bold text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">No data found.</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className="p-4 align-middle">
                    {col.render ? col.render(item) : item[col.accessor]}
                  </td>
                ))}
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Edit"
                      >
                        <RiEditLine size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(item._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
