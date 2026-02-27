import React from 'react';

const SdgGoals = () => {
  const goals = [
    {
      number: "8",
      title: "Decent Work and Economic Growth",
      description: "Creating sustainable employment in Kenya's textile sector",
      color: "#D03358", // Official SDG 8 Pink/Red
      bgLight: "bg-[#D03358]",
    },
    {
      number: "12",
      title: "Responsible Consumption and Production",
      description: "Circular fashion that reduces waste and extends product lifecycles",
      color: "#CF8D2A", // Official SDG 12 Orange/Mustard
      bgLight: "bg-[#CF8D2A]",
    },
    {
      number: "13",
      title: "Climate Action",
      description: "Reducing textile waste emissions and carbon footprint",
      color: "#48773E", // Official SDG 13 Green
      bgLight: "bg-[#48773E]",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.25rem] leading-[1.2]">
            UN Sustainable Development Goals
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground leading-[1.6]">
            Our operations directly contribute to three key UN SDGs, creating measurable impact across economic, environmental, and social dimensions.
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {goals.map((goal, index) => (
            <div
              key={index}
              className="flex flex-col rounded-[1rem] border border-border bg-white p-8 shadow-md transition-shadow hover:shadow-lg"
            >
              {/* Badge */}
              <div 
                className={`mb-6 flex h-10 w-12 items-center justify-center rounded-md font-bold text-white shadow-sm ${goal.bgLight}`}
                style={{ backgroundColor: goal.color }}
              >
                <span className="text-lg">{goal.number}</span>
              </div>

              {/* Content */}
              <h3 className="mb-3 text-[1.25rem] font-semibold leading-[1.4] text-foreground">
                {goal.title}
              </h3>
              <p className="text-sm leading-[1.6] text-muted-foreground">
                {goal.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Credit */}
        <div className="mt-12 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
            Committed to the <span className="font-semibold text-foreground">UN 2030 Agenda for Sustainable Development</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SdgGoals;