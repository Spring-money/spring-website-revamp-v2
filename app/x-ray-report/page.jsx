"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function LinkList() {
    const [data, setData] = useState([])
    useEffect(() => {
        async function fetchData() {
            const baseURL = "/api/get_list_of_all_forms";
            //   const baseURL="http://localhost:8080/";
            let response = await fetch(baseURL, { method: "GET" })
            response = await response.json();

            setData([...response.data]);
            console.log('response', response)
        }

        fetchData();
    }, [])
    return (
        <div className="AppParent">
            <section className="linkList">
                <div style={{ margin: "15px", display: "flex", gap: "10px" }}>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>user name</th>
                                <th>user email</th>
                                <th>phone no.</th>
                                <th>total_score</th>
                                <th>health_check_user</th>
                                <th>health_check_lead_profile</th>
                                <th>link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((key, index) => {
                                return (
                                    <tr key={key.user_email_id + 'xyz' + index}>
                                        <td>{key.user_name ? key.user_name : "default user"}</td>
                                        <td>{key.user_email_id ? key.user_email_id : "null"}</td>
                                        <td>{key.phone_number ? key.phone_number : "null"}</td>
                                        <td>{key.total_score ? key.total_score : "null"}</td>
                                        <td>{key.health_check_user ? key.health_check_user : "null"}</td>
                                        <td>{key.health_check_lead_profile ? key.health_check_lead_profile : "null"}</td>
                                        <td><Link href={`/x-ray-report/${key.name}`} >link</Link></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default LinkList;