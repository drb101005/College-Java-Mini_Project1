export default function QuestionCard({ question }) {
  return (
    <div className="bg-[#1a1a2e] text-gray-200 p-5 rounded-xl shadow hover:shadow-md transition duration-200 mb-4">
      {/* Stats */}
      <div className="flex gap-6">
        <div className="w-28 flex-shrink-0 text-sm text-gray-400 flex flex-col items-end gap-2">
          <div>{question.votes} <span className="text-gray-500">votes</span></div>
          <div
            className={`px-2 py-0.5 rounded-lg border text-xs font-medium ${
              question.answers > 0
                ? 'border-green-500 text-green-400'
                : 'border-gray-600 text-gray-400'
            }`}
          >
            {question.answers} answers
          </div>
          <div>{question.views} <span className="text-gray-500">views</span></div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <a
            href="#"
            className="text-lg font-semibold text-violet-300 hover:text-violet-200 transition"
          >
            {question.title}
          </a>

          <p className="text-sm text-gray-400 mt-2">
            {question.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {question.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md text-xs font-medium bg-violet-800/30 text-violet-300 hover:bg-violet-700/40 transition"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Asked info */}
          <div className="text-xs text-gray-500 mt-3">
            asked {question.asked}
          </div>
        </div>
      </div>
    </div>
  );
}
