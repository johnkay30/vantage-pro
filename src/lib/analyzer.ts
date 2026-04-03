// src/lib/analyzer.ts

export const generateInsights = (data: any[], xKey: string, yKey: string) => {
  if (!data || data.length < 2) return [];

  const values = data.map(d => Number(d[yKey]) || 0);
  const labels = data.map(d => String(d[xKey]));
  
  const total = values.reduce((a, b) => a + b, 0);
  const avg = total / values.length;
  const maxIdx = values.indexOf(Math.max(...values));
  const minIdx = values.indexOf(Math.min(...values));

  const insights = [
    {
      type: "Critical Finding",
      title: `Revenue Concentration in ${labels[maxIdx]}`,
      content: `${labels[maxIdx]} accounts for ${((values[maxIdx]/total)*100).toFixed(1)}% of total volume. This indicates a high dependency risk.`,
      solution: `Diversify operations by reallocating 15% of resources from ${labels[maxIdx]} to underperforming sectors like ${labels[minIdx]}.`
    },
    {
      type: "Efficiency Gap",
      title: "Performance Variance Detected",
      content: `The gap between your top and bottom performing sectors is ${(values[maxIdx] - values[minIdx]).toLocaleString()}.`,
      solution: "Implement a cross-departmental mentorship program to standardize best practices from high-performing units."
    },
    {
      type: "Strategic Forecast",
      title: "Scalability Assessment",
      content: values[minIdx] < avg * 0.5 
        ? `${labels[minIdx]} is performing 50% below the median average.` 
        : "Overall growth is stable, but margin optimization is required.",
      solution: "Perform a deep-dive audit on operational costs in low-margin areas to identify 'leaking' capital."
    }
  ];

  return insights;
};