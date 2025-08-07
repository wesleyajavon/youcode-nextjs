import StatChart from "../client/StatChart";

// This component is used to render a statistical chart on the server side.
// It accepts data, a ChartComponent, and optional props for customization.
// The ChartComponent is a React component that will be used to render the chart.
// The data is expected to be an array of objects, and the chartProps can be used
// to pass additional properties to the ChartComponent.
export function StatChartServer({
    data,
    ChartComponent,
    cardDescription,
    subDescription1,
    subDescription2,
    chartProps,
}: {
    data: Object[],
    ChartComponent: React.ElementType,
    cardDescription?: string,
    subDescription1?: string,
    subDescription2?: string,
    chartProps?: Object,
}) {
    return (
        <StatChart
            data={data}
            ChartComponent={ChartComponent}
            chartProps={chartProps}
            cardDescription={cardDescription}
            subDescription1={subDescription1}
            subDescription2={subDescription2}
        />
    );
}