import Button from '@/components/ui/Button';

export type LayoutType = 'list' | 'kanban';

interface LayoutToggleProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export default function LayoutToggle({
  currentLayout,
  onLayoutChange,
}: LayoutToggleProps) {
  return (
    <div className='flex bg-gray-100 rounded-lg p-1'>
      <Button
        onClick={() => onLayoutChange('list')}
        variant={currentLayout === 'list' ? 'primary' : 'secondary'}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
          currentLayout === 'list'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        leftIcon={<span>📋</span>}
      >
        List View
      </Button>
      <Button
        onClick={() => onLayoutChange('kanban')}
        variant={currentLayout === 'kanban' ? 'primary' : 'secondary'}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
          currentLayout === 'kanban'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        leftIcon={<span>📊</span>}
      >
        Kanban View
      </Button>
    </div>
  );
}
