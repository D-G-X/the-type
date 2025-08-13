import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.borderColor = "#efefef22";

export default function UserChart(props: {
  userStatsData: UserInputStatsData[];
  paraLength: number;
}) {
  const data = {
    labels: props.userStatsData.map((data) => data.index),
    datasets: [
      {
        label: "WPM",
        data: props.userStatsData.map((data) => Math.ceil(data.wpm)),
        borderColor: "#4bc0c088",
        backgroundColor: "#4bc0c0",
        tension: 0.4,
      },
      {
        label: "Accuracy",
        data: props.userStatsData.map((data) => Math.ceil(data.acc)),
        borderColor: "#7972ff88",
        backgroundColor: "#7972ff",
        tension: 0.4,
      },
    ],
  };
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        text: "Typing Stats Graph",
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const dataIndex = context[0].dataIndex;
            return `${props.userStatsData[dataIndex].word}`; // replaces "13" with the actual word
          },
        },
      },
    },
  };

  return props.userStatsData.length == 0 ? (
    <div></div>
  ) : (
    <div className="h-96 mb-10">
      <Line data={data} options={options} />
    </div>
  );
}
