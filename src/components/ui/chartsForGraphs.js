// ----------------------------------------------------------------------------------------------------
// Showing mutiple data
// ----------------------------------------------------------------------------------------------------
import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
);

export default function ChartsForGraphs(props) {
    const { dataSets, labelForChart } = props;
    const data = {
        labels: labelForChart,
        datasets: dataSets.map((dataSet) => ({
            label: dataSet.label,
            data: dataSet.graphData,
            backgroundColor: "rgb(0, 0, 0)",
            borderColor: dataSet.lineColor,
            fill: false,
            borderWidth: 2,
            pointRadius: 0
        }))
    }

    const options = {
        maintainAspectRatio: false
    };

    return (
        <div
            className="graph-cell"
            style={{
                position: "relative",
                width: props.width,
                height: props.height,
                marginTop: '1rem',
                color: "White",
                textAlign: "center"
            }}
        >
            <Line
                data={data}
                options={options}
            />
        </div>
    );
}


// ----------------------------------------------------------------------------------------------------