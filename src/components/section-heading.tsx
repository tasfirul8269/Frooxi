
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeading({ 
  title, 
  subtitle, 
  alignment = 'center',
  className = '',
  titleClassName = '',
  subtitleClassName = ''
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`max-w-3xl mx-auto mb-16 ${alignmentClasses[alignment]} ${className}`}>
      <div className="relative inline-block">
        <h2 className="text-3xl md:text-5xl font-bold relative z-10">
          <span className={`bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer ${titleClassName}`}>
            {title}
          </span>
        </h2>
        <div className="absolute -bottom-3 left-0 w-full h-[6px] bg-gradient-to-r from-primary/20 via-secondary/30 to-primary/20 rounded-full blur-sm"></div>
        <div className="absolute -z-10 -inset-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl blur-xl opacity-50"></div>
      </div>
      
      {subtitle && (
        <p className={`mt-6 text-lg text-muted-foreground max-w-2xl mx-auto ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
      
      <div className="mt-4 flex justify-center">
        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
        </div>
      </div>
    </div>
  );
}
