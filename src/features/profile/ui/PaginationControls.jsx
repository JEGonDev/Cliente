import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PaginationControls = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-700">
        Mostrando <span className="font-medium">{(currentPage-1)*itemsPerPage+1}</span> a <span className="font-medium">{Math.min(currentPage*itemsPerPage, totalItems)}</span> de <span className="font-medium">{totalItems}</span> usuarios
      </p>
      <div className="flex justify-end">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            onClick={() => setCurrentPage(Math.max(1, currentPage-1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 ${currentPage === i+1 ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-white text-gray-700 hover:bg-gray-50"} text-sm font-medium`}
              onClick={() => setCurrentPage(i+1)}
            >
              {i+1}
            </button>
          ))}
          <button
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage+1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      </div>
    </div>
  );
};