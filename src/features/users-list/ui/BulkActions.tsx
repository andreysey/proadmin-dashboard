import { Trash2, Download, X } from 'lucide-react'
import { Button } from '@/shared/ui'

interface BulkActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onDelete: () => void
  onExport: () => void
}

export const BulkActions = ({
  selectedCount,
  onClearSelection,
  onDelete,
  onExport,
  isDeleting,
}: BulkActionsProps & { isDeleting?: boolean }) => {
  if (selectedCount === 0) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-gray-200 bg-white px-6 py-3 shadow-2xl duration-300">
      <div className="flex items-center gap-2 border-r pr-4">
        <span className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
          {selectedCount}
        </span>
        <span className="text-sm font-medium text-gray-700">Selected</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={onClearSelection}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  )
}
