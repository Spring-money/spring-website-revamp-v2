'use client';
import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import First from './components/First/First'
import Template from './components/Template/Template'
import Footer from './components/Footer/Footer'
import { useParams } from "next/navigation";

function App(props) {

  const [data, setData] = useState({})
  let { name } = useParams()
  if (name == undefined) {
    name = props.name;
  }
  console.log("name", decodeURI(name))
  const category_object = {};

  const loaderRef = useRef(null);


  // newTemplatePageNo.current=templatePageNo.current;

  let score = {};
  let first = {}
  if ("creation" in data) {
    first = { "date": data.creation, "name": data.user_name }
  }

  if ("health_check_summary_table" in data) {
    data.health_check_summary_table.map((summary_data) => {
      if (!(summary_data.category in category_object)) {
        category_object[summary_data.category] = 1;
      }
    })

    data.health_check_score_table.map((score_data) => {
      if ("score" in score_data) {
        score[score_data.category] = score_data.score;
      }
    })
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const baseURL = `/api/get_details_of_health_check_form_result`;
        let data = { name: decodeURI(name) };
        let response = await fetch(baseURL, {
          method: "POST",
          body: JSON.stringify(data)
        })
        response = await response.json();

        console.log(" main response", response)
        setData(response.data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, [])


  console.log("App")
  return (
    <div className="AppParent">
      <div className="App">
        <div>
          <First score={score} data={first}></First>
          {Object.keys(category_object).map((category, index) => {
            // templatePageNo.current=index+newTemplatePageNo.current;
            return (
              <React.Fragment key={category}>
                <Template uniqueid={"main" + category} key={category} data={data}>{category}</Template>
              </React.Fragment>
            )
          })}
          <Footer>What&rsquo;s Next</Footer>
        </div>
        <div ref={loaderRef} className="loader-container">
          <div className="loader"></div>
        </div>
      </div>
    </div>

  )
}

export default App
