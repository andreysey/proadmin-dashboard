import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui'
import { Info, ShieldCheck, Zap, Layers } from 'lucide-react'

export const AboutPage = () => {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          About ProAdmin Dashboard
        </h1>
        <p className="text-muted-foreground max-w-[700px] text-lg">
          A high-performance, resilient, and architecturally sound administration platform built for
          modern business needs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <ShieldCheck className="text-primary h-8 w-8" />
            <CardTitle>Security First</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Implemented with robust JWT silent refresh logic, secure token storage, and a
              proactive request retry mechanism. Your sessions are automatically protected and
              managed with zero interruption to your workflow.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Zap className="text-primary h-8 w-8" />
            <CardTitle>Optimized UX</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Powered by TanStack Query for high-speed data fetching. Features smooth loading
              skeletons, instant notifications, and a <strong>mobile-first</strong> responsive
              design that adapts seamlessly to any device.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Layers className="text-primary h-8 w-8" />
            <CardTitle>Solid Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Strictly follows <strong>Feature-Sliced Design (FSD)</strong> principles. This ensures
              high cohesion and low coupling, making the codebase highly scalable, maintainable, and
              easy for large teams to collaborate on.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Info className="text-primary h-8 w-8" />
            <CardTitle>Modern Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• React 19 + TypeScript</li>
              <li>• TanStack Router & Query</li>
              <li>• Tailwind CSS v4 + shadcn/ui</li>
              <li>• MSW for robust API Mocking</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>System Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">
            The mission of ProAdmin is to provide a standardized toolset for managing users,
            permissions, and analytics with absolute reliability. By combining cutting-edge frontend
            technologies with professional architectural patterns, we deliver an enterprise-ready
            dashboard experience.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <p className="text-muted-foreground text-xs font-medium">
          ProAdmin Dashboard • Version {__APP_VERSION__} • Built with ❤️ and Precision
        </p>
      </div>
    </div>
  )
}
