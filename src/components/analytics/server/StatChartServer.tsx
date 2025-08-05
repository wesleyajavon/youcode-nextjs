import StatChart from "../client/StatChart";

// This function is used to render the AdminCoursesTableUI component on the server side.
// It retrieves the user's session to determine their role and permissions.
// The AdminCoursesTableUI component displays a table of courses with options to create, edit,
// and manage courses based on the user's role.
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