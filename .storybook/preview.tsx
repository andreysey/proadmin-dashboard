import type { Preview } from '@storybook/react-vite'
import '../src/app/styles/index.css'
import React from 'react'

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'

      // Use effect to handle side-effects safely
      React.useEffect(() => {
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(theme)

        // Apply theme colors to body to ensure full coverage without wrapper hacks
        document.body.classList.add('bg-background', 'text-foreground')
      }, [theme])

      return (
        <div className="bg-background text-foreground w-full rounded-md border p-6 text-left">
          <Story />
        </div>
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
