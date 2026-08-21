import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

type QuizRecord = {
  id: number
  name?: string
  email?: string
  quiz_type?: string
  headline?: string
  status?: string
  created_at?: string
}

export default function App() {
  const [status, setStatus] = useState('Checking Supabase connection...')
  const [rows, setRows] = useState<QuizRecord[]>([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    quiz_type: 'personality',
    headline: '',
    status: 'new',
  })
  const [isSaving, setIsSaving] = useState(false)

  async function loadSubmissions() {
    const { data, error } = await supabase
      .from('submissions')
      .select('id, name, email, quiz_type, headline, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      setStatus(`Мэдээлэл уншихад алдаа гарлаа: ${error.message}`)
      return
    }

    setRows(data ?? [])
    setStatus('Supabase connected successfully.')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)

    const { error } = await supabase.from('submissions').insert({
      name: form.name,
      email: form.email,
      age: Number(form.age),
      gender: form.gender,
      quiz_type: form.quiz_type,
      headline: form.headline,
      status: form.status,
    })

    if (error) {
      setStatus(`Бүртгэл хадгалахад алдаа гарлаа: ${error.message}`)
    } else {
      setForm({ name: '', email: '', age: '', gender: '', quiz_type: 'personality', headline: '', status: 'new' })
      setStatus('Шинэ хэрэглэгч амжилттай хадгалагдлаа.')
      await loadSubmissions()
    }

    setIsSaving(false)
  }

  useEffect(() => {
    loadSubmissions()
  }, [])

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">ViralQuiz</p>
        <h1>Supabase connected</h1>
        <p className="status">{status}</p>

        <form className="submission-form" onSubmit={handleSubmit}>
          <input required placeholder="Нэр" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input required type="email" placeholder="Имэйл" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input required type="number" min="1" placeholder="Нас" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} />
          <input required placeholder="Хүйс" value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} />
          <input required placeholder="Гарчиг" value={form.headline} onChange={(event) => setForm({ ...form, headline: event.target.value })} />
          <button type="submit" disabled={isSaving}>{isSaving ? 'Хадгалж байна...' : 'Бүртгүүлэх'}</button>
        </form>

        {rows.length > 0 ? (
          <ul className="quiz-list">
            {rows.map((row) => (
              <li key={row.id}>
                <span>#{row.id}</span>
                <div>
                  <strong>{row.name ?? 'Нэргүй хэрэглэгч'}</strong>
                  <small>{row.email ?? 'Имэйлгүй'} · {row.quiz_type ?? 'Төрөлгүй'}</small>
                  <small>{row.headline ?? 'Гарчиггүй'} · {row.status ?? 'Төлөвгүй'}</small>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            Add a table named <strong>submissions</strong> in Supabase and set
            <strong> VITE_SUPABASE_URL</strong> and
            <strong> VITE_SUPABASE_ANON_KEY</strong> to see live data here.
          </p>
        )}
      </section>
    </main>
  )
}
