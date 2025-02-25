import { ArrowRight, CheckCircle, Bitcoin, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

interface PricingPlanProps {
  title: string
  price: string
  description: string
  features: string[]
  ctaText: string
  ctaHref: string
}

export default function PricingPlan({
  title,
  price,
  description,
  features,
  ctaText,
  ctaHref,
}: PricingPlanProps) {
  return (
    <Card className="max-w-sm flex flex-col bg-white border border-blue-300 rounded-2xl shadow-md p-6 space-y-6 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="space-y-4">
        <h3 className="text-lg font-bold uppercase text-blue-800">{title}</h3>
        <p className="text-4xl font-extrabold text-blue-600">{price}</p>
        <p className="text-gray-600">{description}</p>
      </CardHeader>

      <CardContent>
        <p className="text-sm font-medium text-gray-700 mb-3">Payments available</p>
        <div className="flex space-x-2 mb-4">
          <Bitcoin className="w-5 h-5 text-blue-600" />
          <DollarSign className="w-5 h-5 text-blue-600" />
        </div>
        <p className="font-semibold text-gray-800">What you will get:</p>
        <ul className="mt-3 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2 text-gray-700">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          asChild
          variant="secondary"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg"
        >
          <Link href={ctaHref} className="flex justify-center items-center space-x-2">
            <span>{ctaText}</span> <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
