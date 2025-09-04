import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import AskQuestionModal from '../components/AskQuestionModal.jsx'
import { getSession } from '../utils/auth.js'
import sample from '../data/sampleQuestions.js'


export default function Home() {
const session = getSession()
const [query, setQuery] = useState('')
const [showAsk, setShowAsk] = useState(false)
const [questions, setQuestions] = useState(sample)


const filtered = useMemo(() => {
const q = query.toLowerCase()
return questions.filter(x => x.title.toLowerCase().includes(q) || x.tags.some(t => t.toLowerCase().includes(q)))
}, [query, questions])


return (
<div className="min-h-screen">
<Navbar query={query} setQuery={setQuery} />
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-[220px,1fr,300px] gap-6 mt-6">
<Sidebar role={session?.role} />
<main>
<div className="flex items-center justify-between mb-4">
<h2 className="text-xl font-semibold">Top Questions</h2>
<button onClick={() => setShowAsk(true)} className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-4 py-2">Ask question</button>
</div>
<div className="space-y-3">
{filtered.map(q => (
<QuestionCard key={q.id} question={q} />
))}
{filtered.length === 0 && (
<div className="text-sm text-gray-600">No results. Try a different search.</div>
)}
</div>
</main>
<aside className="space-y-4">
<div className="bg-white rounded-2xl shadow-soft p-4">
<h3 className="font-medium mb-2">Mentor Spotlight</h3>
<p className="text-sm text-gray-600">Verified mentors answer with a <span className="font-semibold">Mentor</span> badge.</p>
{session?.role === 'mentor' && <p className="mt-2 text-xs text-brand-700">You’re logged in as a mentor. Thank you for helping students!</p>}
</div>
<div className="bg-white rounded-2xl shadow-soft p-4">
<h3 className="font-medium mb-2">Guidelines</h3>
<ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
<li>Search before asking</li>
<li>Include code and expected output</li>
<li>Be respectful & specific</li>
</ul>
</div>
</aside>
</div>
{showAsk && (
<AskQuestionModal onClose={() => setShowAsk(false)} onSubmit={(q) => {
setQuestions(prev => [{...q, id: prev.length + 1, votes: 0, answers: 0, views: 0}, ...prev])
setShowAsk(false)
}} />
)}
</div>
)
}
