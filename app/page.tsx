import { Button } from '@/components/ui/button'
import {
  IconArrowRight,
  IconBrandZapier,
  IconCircleCheck,
  IconShield,
  IconSparkles,
} from '@tabler/icons-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-accent/5" />

        <div className="mx-auto max-w-4xl px-6 py-24 md:py-32">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <IconSparkles className="h-3.5 w-3.5" />
              Хиймэл оюунд суурилсан арьсны оншилгоо
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Арьсныхаа бодит боломжийг нээ
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed text-pretty">
              Арьсны тань өвөрмөц онцлогийг илрүүлэх мэргэжлийн хиймэл оюуны шинжилгээ. Хувь хүнд
              тохирсон дүгнэлт, мэргэжлийн зөвлөмж авна уу.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 px-8" asChild>
                <Link href="/flow/capture">
                  Шинжилгээг эхлүүлэх
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Pricing hint */}
            <p className="mt-4 text-sm text-muted-foreground">
              Нэг удаагийн шинжилгээ: ₮5,000 ☕️ — CU кофеийн үнэ.
            </p>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto mt-16 max-w-lg">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 via-secondary to-accent/20">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
                  <IconSparkles className="h-10 w-10 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Дэвшилтэт хиймэл оюуны шинжилгээ
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Бүтэц, нүх сүв, чийгшил гэх мэт
                </p>
              </div>

              {/* Floating stats */}
              <div className="absolute -right-2 top-1/4 rounded-xl bg-background/90 p-3 shadow-sm backdrop-blur-sm md:-right-6">
                <p className="text-lg font-semibold text-foreground">98%</p>
                <p className="text-[10px] text-muted-foreground">Нарийвчлал</p>
              </div>

              <div className="absolute -left-2 bottom-1/4 rounded-xl bg-background/90 p-3 shadow-sm backdrop-blur-sm md:-left-6">
                <p className="text-lg font-semibold text-foreground">60 сек</p>
                <p className="text-[10px] text-muted-foreground">Үр дүн</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="mb-12 text-center text-2xl font-semibold text-foreground">
            Хэрхэн ажилладаг вэ
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <IconSparkles className="h-5 w-5" />,
                title: 'Зураг авах',
                description: 'Нүүрний зургийг авна',
              },
              {
                icon: <IconBrandZapier className="h-5 w-5" />,
                title: 'Шинжилгээ хийх',
                description: 'ХО нь бүтэц, нүх сүв зэрэг олон үзүүлэлтийг шинжилнэ',
              },
              {
                icon: <IconCircleCheck className="h-5 w-5" />,
                title: 'Үр дүн',
                description: 'Нарийвчилсан PDF тайлангаа авна',
              },
            ].map((feature, i) => (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <span className="mb-1 text-xs text-muted-foreground">0{i + 1}</span>
                <h3 className="mb-2 font-medium text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & CTA */}
      <section className="bg-background">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <IconShield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-medium text-foreground">Нууцлал чухал</h3>
              <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
                Таны зургуудыг бид хадгалдаггүй. Зургуудыг шууд шинжилж, үр дүн гарсны дараа даруй
                устгана.
              </p>
            </div>
            <Button size="lg" className="mt-4 gap-2" asChild>
              <Link href="/flow/capture">
                Эхлэх
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-2">
              <IconSparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">SkinAI</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Хиймэл оюунд суурилсан мэргэжлийн арьсны шинжилгээ
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
