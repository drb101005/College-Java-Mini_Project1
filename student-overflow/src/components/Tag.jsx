import Tag from './Tag';



<div className="flex flex-wrap gap-2 mt-3">
  {question.tags.map(tag => (
    <Tag key={tag} name={tag} />
  ))}
</div>
