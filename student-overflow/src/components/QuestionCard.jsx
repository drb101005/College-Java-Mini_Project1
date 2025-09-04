export default function QuestionCard({ question }) {
  return (
    <div className="border-b py-4 flex gap-6">
      {/* Stats */}
      <div className="w-28 flex-shrink-0 text-sm text-gray-600 flex flex-col items-end gap-1">
        <div>{question.votes} votes</div>
        <div
          className={`px-2 py-0.5 rounded-lg border text-xs ${
            question.answers > 0
              ? 'border-green-600 text-green-700'
              : 'border-gray-300 text-gray-600'
          }`}
        >
          {question.answers} answers
        </div>
        <div>{question.views} views</div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <a
          href="#"
          className="text-lg text-blue-600 hover:text-blue-800 font-medium"
        >
          {question.title}
        </a>
        <p className="text-sm text-gray-700 mt-1">{question.excerpt}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {question.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          asked {question.asked}
        </div>
      </div>
    </div>
  )
}
