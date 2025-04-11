'use client';

import './First.css'
import Image from 'next/image';
import x_ray_report_honeyComb from '../../../../../public/financial-x-ray/x_ray_report_honeyComb.svg';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);


function First(props) {

  const options = {
    aspectRatio: 1,
    plugins: {
      legend: {

        display: false

      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          font: {
            size: 14
          }
        },
        pointLabels: {
          font: {
            size: 12
          },
          color: "black"
        }
      },
    },

  }

  let head;
  if ("date" in props.data) {
    let date = new Date(props.data.date)
    date = date.toDateString().split(" ");
    head = <div className="First-head">
      <p>{props.data.name}</p>
      <p>{date[1]}, {date[2]} {date[3]}</p>
    </div>
  }
  // console.log(props.score["Savings & Budgeting"],props.score.Investments, props.score.Insurance, props.score.Loan, props.score.Taxation)
  console.log(props.score)
  const data = {
    labels: ['Savings & Budgeting', 'Investment', 'Insurance', 'Loans', 'Taxation'],
    datasets: [
      {
        label: '%',
        data: [props.score["Savings & Budgeting"], props.score.Investment, props.score.Insurance, props.score.Loans, props.score.Taxation],
        backgroundColor: ['rgba(64, 196, 139, 0.223)'],
        borderColor: 'rgba(14, 82, 53, 0.80)',
        borderWidth: 3,
      },
    ],
  };

  return (
    <section className="First">
      {head}
      <figure className="First-honeyComb-img">
        <Image src={x_ray_report_honeyComb} alt="honeyComb" />
      </figure>
      <div className="First-top-line" ></div>
      <div className="First-heading">
        Financial X-Ray Report
      </div>
      <div className="First-content">
        The Financial X-ray report provides a snapshot of your financial well-being, highlighting positive aspects and areas requiring attention. It covers five main areas: Savings and Budgeting, Loans and Debts, Investments, Taxation, and Insurance. Use the insights from the X-ray report to make informed decisions and implement improvements where necessary, ensuring stress free financial future.
      </div>
      <div className="radar-graph">
        <div>
          <Radar data={data} options={options} />
        </div>
      </div>
      <div className="First-bottom-line" ></div>
    </section>
  );
};
export default First;