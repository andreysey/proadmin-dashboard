import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Card> = {
  title: 'Shared/UI/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
}
