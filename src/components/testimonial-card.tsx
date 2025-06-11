
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export function TestimonialCard({ quote, author, role, company }: TestimonialCardProps) {
  return (
    <Card className="h-full flex flex-col border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-lg">{quote}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="font-medium">{author}</p>
        <p className="text-sm text-muted-foreground">{role}, {company}</p>
      </CardFooter>
    </Card>
  );
}
