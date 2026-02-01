import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui'
import { Info, ShieldCheck, Zap, Layers, Github, Linkedin } from 'lucide-react'
import { useTranslation, Trans } from 'react-i18next'
import { SOCIAL_LINKS } from '@/shared/config'

export const AboutPage = () => {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{t('about.title')}</h1>
        <p className="text-muted-foreground max-w-[700px] text-lg">{t('about.description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <ShieldCheck className="text-primary h-8 w-8" />
            <CardTitle>{t('about.security.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('about.security.desc')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Zap className="text-primary h-8 w-8" />
            <CardTitle>{t('about.ux.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              <Trans i18nKey="about.ux.desc">
                Powered by TanStack Query for high-speed data fetching. Features smooth loading
                skeletons, instant notifications, and a <strong>mobile-first</strong> responsive
                design that adapts seamlessly to any device.
              </Trans>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Layers className="text-primary h-8 w-8" />
            <CardTitle>{t('about.arch.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              <Trans i18nKey="about.arch.desc">
                Strictly follows <strong>Feature-Sliced Design (FSD)</strong> principles. This
                ensures high cohesion and low coupling, making the codebase highly scalable,
                maintainable, and easy for large teams to collaborate on.
              </Trans>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Info className="text-primary h-8 w-8" />
            <CardTitle>{t('about.tech.title')}</CardTitle>
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
          <CardTitle>{t('about.mission.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{t('about.mission.desc')}</p>
        </CardContent>
      </Card>

      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">{t('about.connect.title')}</h2>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" asChild className="gap-2">
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
              {t('about.connect.github')}
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild className="gap-2">
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5 text-[#0077b5]" />
              {t('about.connect.linkedin')}
            </a>
          </Button>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <p className="text-muted-foreground text-xs font-medium">
          {t('about.footer', { version: __APP_VERSION__ })}
        </p>
      </div>
    </div>
  )
}
