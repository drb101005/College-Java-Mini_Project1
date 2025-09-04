import { useState } from 'react'

export default function AskQuestionModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Ask a public question</h3>
          <button className="text-sm" onClick={onClose}>✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Be specific and imagine you’re asking a student"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Body</label>
            <textarea
              rows={6}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Include code, expected behavior, and what you’ve tried"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g., java, react, data-structures"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button className="rounded-xl border px-4 py-2" onClick={onClose}>
              Cancel
            </button>
            <button
              className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-4 py-2"
              onClick={() => {
                if (!title.trim()) return
                onSubmit({
                  title,
                  excerpt:
                    body.slice(0, 160) + (body.length > 160 ? '…' : ''),
                  tags: tags
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean),
                  asked: 'just now',
                })
              }}
            >
              Post question
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
