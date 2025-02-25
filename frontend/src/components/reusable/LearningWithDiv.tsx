import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

interface CommunityCardProps {
  title: string
  description: string
  ctaText: string
  ctaHref: string
}

export default function CommunityCard({
  title = "A vast community of awesome Fx traders.",
  description = "We foster a trading community of over 100,000 subscribers where high quality signals, trading resources, and tools are shared for free.",
  ctaText = "Join our community",
  ctaHref = "#",
}: CommunityCardProps) {
  return (
    <Card className="max-w-md bg-blue-50 border border-blue-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 space-y-6">
      <CardHeader className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
      </CardHeader>
      <CardContent>
        <p className="text-blue-600">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
          <Link href={ctaHref}>
            {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function CommunityCardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div>
        <CommunityCard
          title="Forex Traders Hub"
          description="A place for traders to connect, learn, and share strategies."
          ctaText="Join the Hub"
          ctaHref="#"
        />
      </div>
      <div>
        <CommunityCard
          title="Crypto Traders Community"
          description="Join the crypto trading community for tips and resources."
          ctaText="Join the Community"
          ctaHref="#"
        />
      </div>
      <div>
        <CommunityCard
          title="Advanced Trading Strategies"
          description="Learn advanced trading strategies from experts."
          ctaText="Learn More"
          ctaHref="#"
        />
      </div>
      <div>
        <CommunityCard
          title="Trading Resources Library"
          description="Access a library of valuable trading resources."
          ctaText="Access Resources"
          ctaHref="#"
        />
      </div>
      <div>
        <CommunityCard
          title="Forex Signal Group"
          description="Get trading signals in real-time from top traders."
          ctaText="Get Signals"
          ctaHref="#"
        />
      </div>
      <div>
        <CommunityCard
          title="Trading Tools Exchange"
          description="Exchange trading tools and strategies with fellow traders."
          ctaText="Join the Exchange"
          ctaHref="#"
        />
      </div>
    </div>
  )
}
