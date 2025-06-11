
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg glass-card border-0 group">
      <CardHeader className="p-6 pb-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
