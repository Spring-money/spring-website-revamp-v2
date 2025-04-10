import React from 'react'
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
function Index(props) {
    const data={
        labels:['Principle Amount','Interest Amount'],
        datasets:[{
            label:"Total Amount",
            data:[props.principle_amount,props.interest_amount],
            backgroundColor:['#525ECC','#525ECC26']
        }]
    }
    const options ={

    }
  return (
    <div>
      <div>
        <div style={{ width:'0.5rem',height:'0.5rem'}}></div>
        <Doughnut data={data} options={options}></Doughnut>
      </div>
    </div>
  )
}

export default Index;
