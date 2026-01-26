import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const results = [
  {
    title: "Hydration map",
    description: "Deep hydration is strong around the T-zone with mild dryness on the cheeks.",
    src: "/results/result-1.svg",
  },
  {
    title: "Texture analysis",
    description: "Visible pore texture on the forehead and mid-cheek; smoothness improves toward jawline.",
    src: "/results/result-2.svg",
  },
  {
    title: "Tone balance",
    description: "Overall tone is even, with a slightly warmer area near the nose bridge.",
    src: "/results/result-3.svg",
  },
];

export default function ResultsStepPage() {
  return (
    <section className="min-w-0 space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold sm:text-3xl">Results</h2>
        <p className="text-sm text-muted-foreground">Swipe to review.</p>
      </div>
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
    </section>
  );
}
