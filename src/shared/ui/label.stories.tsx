import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './label'

const meta: Meta<typeof Label> = {
  title: 'Shared/UI/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    children: 'This is a label',
  },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {}

export const Required: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label {...args} />
      <span className="text-muted-foreground text-sm">(Helper text example)</span>
    </div>
  ),
}
