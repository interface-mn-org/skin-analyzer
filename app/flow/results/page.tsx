/* eslint-disable @next/next/no-img-element */
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { IconRefresh, IconShare } from '@tabler/icons-react'

const results = [
  {
    title: 'Hydration map',
    description: 'Deep hydration is strong around the T-zone with mild dryness on the cheeks.',
    src: '/results/result-1.svg',
  },
  {
    title: 'Texture analysis',
    description:
      'Visible pore texture on the forehead and mid-cheek; smoothness improves toward jawline.',
    src: '/results/result-2.svg',
  },
  {
    title: 'Tone balance',
    description: 'Overall tone is even, with a slightly warmer area near the nose bridge.',
    src: '/results/result-3.svg',
  },
]

export default function ResultsStepPage() {
  return (
    <div className="flex flex-col min-h-svh">
      <Header title="Get Results" step={4} />

      <main className="flex-1 px-4 py-6 md:px-8 md:py-10 pb-36 md:pb-10">
        <div className="max-w-md mx-auto space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground text-balance">
              Results
            </h1>
            <p className="text-muted-foreground text-balance">Swipe to review.</p>
          </div>
          {/* Auth Options */}
          <div className="space-y-4">
            <Carousel className="relative min-w-0">
              <CarouselContent>
                {results.map((result) => (
                  <CarouselItem key={result.title}>
                    <Card className="min-w-0 border-border bg-card/60 text-card-foreground">
                      <CardHeader>
                        <CardTitle>{result.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {result.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-hidden rounded-2xl border border-border bg-muted/40 p-4">
                          <img
                            src={result.src}
                            alt={result.title}
                            className="h-64 w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 top-full mt-4 border-border bg-card text-foreground hover:bg-muted sm:-left-5 sm:top-1/2 sm:mt-0" />
              <CarouselNext className="right-2 top-full mt-4 border-border bg-card text-foreground hover:bg-muted sm:-right-5 sm:top-1/2 sm:mt-0" />
            </Carousel>
          </div>
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 inset-x-0 p-4 bg-background/80 backdrop-blur-md border-t">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          <Button variant="outline" size="lg" className="w-full">
            <IconRefresh className="size-4" />
            Start Over
          </Button>
          <Button variant="default" size="lg" className="w-full">
            <IconShare className="size-4" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  )
}
