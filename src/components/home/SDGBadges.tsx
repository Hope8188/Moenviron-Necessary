import { useCMSContent } from "@/hooks/useCMSContent";

interface SDGGoal {
  number: number;
  title: string;
  description: string;
  color: string;
}

const defaultSdgGoals: SDGGoal[] = [
  {
    number: 8,
    title: "Decent Work and Economic Growth",
    description: "Creating sustainable employment in Kenya's textile sector",
    color: "hsl(345 70% 45%)",
  },
  {
    number: 12,
    title: "Responsible Consumption and Production",
    description: "Circular fashion that reduces waste and extends product lifecycles",
    color: "hsl(32 85% 42%)",
  },
  {
    number: 13,
    title: "Climate Action",
    description: "Reducing textile waste emissions and carbon footprint",
    color: "hsl(150 50% 35%)",
  },
];

interface SDGBadgesContent {
  title?: string;
  subtitle?: string;
  badges?: SDGGoal[];
}

export function SDGBadges() {
  const { data: cms } = useCMSContent("home", "sdg-badges");

  const cmsContent = (cms?.content || {}) as SDGBadgesContent;
  const content = {
    title: cmsContent.title || "UN Sustainable Development Goals",
    subtitle: cmsContent.subtitle || "Our operations directly contribute to three key UN SDGs, creating measurable impact across economic, environmental, and social dimensions.",
    badges: cmsContent.badges || defaultSdgGoals
  };

  const goals: SDGGoal[] = content.badges;

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {content.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {goals.map((goal: SDGGoal, index: number) => (
            <div
              key={goal.number}
              className="group relative overflow-hidden rounded-xl border border-border bg-background p-6 shadow-soft transition-all hover:shadow-medium animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* SDG Number Badge */}
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg text-2xl font-bold text-white"
                style={{ backgroundColor: goal.color }}
              >
                {goal.number}
              </div>

              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {goal.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {goal.description}
              </p>

              {/* Hover Accent */}
              <div
                className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ backgroundColor: goal.color }}
              />
            </div>
          ))}
        </div>

        {/* UN Partnership Badge */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Committed to the{" "}
            <a
              href="https://sdgs.un.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              UN 2030 Agenda for Sustainable Development
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
