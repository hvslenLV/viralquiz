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

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, name, email, quiz_type, headline, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        setStatus(`Supabase is ready to connect, but the table is not configured yet: ${error.message}`)
        return
      }

      setRows(data ?? [])
      setStatus('Supabase connected successfully.')
    }

    loadData()
  }, [])

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">ViralQuiz</p>
        <h1>Supabase connected</h1>
        <p className="status">{status}</p>

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
