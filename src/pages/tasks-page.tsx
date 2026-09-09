import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckSquare, Loader2, Plus } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { TaskFilters } from '@/features/tasks/task-filters'
import { TaskForm } from '@/features/tasks/task-form'
import { TaskRow } from '@/features/tasks/task-row'
import { useTaskFilters } from '@/features/tasks/use-task-filters'
import { useAuth } from '@/hooks/use-auth'
import { tasksQueryKey, useTasks } from '@/hooks/use-tasks'
import { useWedding } from '@/hooks/use-wedding'
import { createTask, deleteTask, setTaskStatus, updateTask } from '@/services/tasks'
import type { Task } from '@/services/tasks'

export function TasksPage() {
  const { data: wedding } = useWedding()
  const { user } = useAuth()
  const { data: tasks, isPending } = useTasks(wedding!.id)
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState<Task | undefined>(undefined)
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null)

  const { filters, onChange, filteredTasks } = useTaskFilters(tasks ?? [])

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: tasksQueryKey(wedding!.id) })
  }

  const createMutation = useMutation({
    mutationFn: (input: Parameters<typeof createTask>[2]) => createTask(wedding!.id, user!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: Parameters<typeof updateTask>[1]) => updateTask(editingTask!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
      setEditingTask(undefined)
    },
  })

  const toggleCompleteMutation = useMutation({
    mutationFn: (task: Task) => setTaskStatus(task.id, task.status === 'completed' ? 'not_started' : 'completed'),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (task: Task) => deleteTask(task.id),
    onSuccess: () => {
      invalidate()
      setDeletingTask(null)
    },
  })

  function openCreateForm() {
    setEditingTask(undefined)
    setFormOpen(true)
  }

  function openEditForm(task: Task) {
    setEditingTask(task)
    setFormOpen(true)
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  const hasNoTasksAtAll = (tasks ?? []).length === 0

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Tasks</h1>
        <Button onClick={openCreateForm}>
          <Plus className="size-4" />
          Add Task
        </Button>
      </div>

      {hasNoTasksAtAll ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Start planning by adding your first to-do — venue booking, invitations, anything on your list."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="size-4" />
              Add Task
            </Button>
          }
        />
      ) : (
        <>
          <TaskFilters filters={filters} onChange={onChange} />

          {filteredTasks.length === 0 ? (
            <EmptyState icon={CheckSquare} title="No tasks match your filters" description="Try adjusting the search or filters above." />
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currency={wedding!.currency}
                  onToggleComplete={(t) => toggleCompleteMutation.mutate(t)}
                  onEdit={openEditForm}
                  onDelete={setDeletingTask}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
          </DialogHeader>
          <TaskForm
            task={editingTask}
            onCancel={() => setFormOpen(false)}
            onSubmit={(input) => (editingTask ? updateMutation.mutateAsync(input) : createMutation.mutateAsync(input))}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingTask)}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        title="Delete this task?"
        description={`"${deletingTask?.name}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete Task"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingTask && deleteMutation.mutate(deletingTask)}
      />
    </div>
  )
}
