import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Trash2, AlertTriangle, BookOpen } from 'lucide-react'
import { subjectsApi } from '../api/subjects'

const SubjectManagement = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({ name: '', icon: '', description: '' })
  const [error, setError] = useState(null)

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectsApi.getAll
  })

  const createMutation = useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      setIsCreating(false)
      setFormData({ name: '', icon: '', description: '' })
      setError(null)
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create subject')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: subjectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    }
  })

  const handleCreate = (e) => {
    e.preventDefault()
    setError(null)
    if (!formData.name) {
      setError('Subject name is required')
      return
    }
    createMutation.mutate(formData)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      deleteMutation.mutate(id)
    }
  }

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
            <p className="mt-2 text-muted-foreground">
              Manage all subjects available for quizzes.
            </p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>

        {isCreating && (
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Subject</h2>
            
            {error && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Icon (Emoji or URL)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="e.g. ➕"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="input-field min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Subject description..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  className="btn-secondary"
                  disabled={createMutation.isPending}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted/50 text-xs uppercase text-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Created Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">Loading subjects...</td>
                  </tr>
                ) : filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p>No subjects found</p>
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((subject) => (
                    <tr key={subject._id} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">
                            {subject.icon || '📚'}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{subject.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {subject._id.substring(subject._id.length - 6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-[250px] truncate">
                        {subject.description || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(subject.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(subject._id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          title="Delete Subject"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectManagement