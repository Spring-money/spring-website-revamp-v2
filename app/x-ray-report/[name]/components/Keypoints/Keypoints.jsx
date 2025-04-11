'use client';

import './Keypoints.css'

function Keypoints(props) {

    return (
        <section className="Keypoints">
            <div className="content-container">
                {props.current_analysis.length > 0 ? (
                    <>
                        <div className="content-heading">
                            Current analysis
                        </div>
                        <ul className="content content list-disc">
                            {props.current_analysis.map((data, index) => { return (<li key={'analysis' + index}> {data}</li>) })}
                        </ul>
                    </>
                ) : ""}
            </div>

            <div className="content-container">
                {props.scope_of_improvement.length > 0 ? (
                    <>
                        <div className="content-heading">
                            Scope for Improvement
                        </div>
                        <ul className="content content list-disc">
                            {props.scope_of_improvement.map((data, index) => {
                                return (
                                    <>
                                        <li key={'uncategorised-suggestions' + index}> {data}</li>
                                    </>)
                            })}
                        </ul>
                    </>
                ) : ""}
            </div>

            <div className="content-container">
                {Object.keys(props.expert_suggestions.categorised).length == 0 && props.expert_suggestions.uncategorised.length == 0 ? "" :
                    (<>
                        <div className="content-heading">
                            Expert Suggestions
                        </div>
                        <ul className="content list-disc">
                            {props.expert_suggestions.uncategorised.map((data, index) => {
                                return (
                                    <>
                                        <li className='marker:text-black-400' key={'uncategorised-suggestions' + index}> {data[0]}</li>
                                        <div className='suggestion-img-container' style={data[1] !== "" ? { margin: "20px 0px" } : {}}>
                                            {data[1] != "" ? <img className='suggestion-img' src={data[1]} alt="image not available"
                                                height="100"
                                                width="400" /> : ""}
                                            {data[2] != "" ? <p>{data[2]}</p> : ""}
                                        </div>

                                    </>
                                )
                            })}
                        </ul>
                        <ul className="content content list-disc">
                            {Object.keys(props.expert_suggestions.categorised).map((key, i) => {
                                return (
                                    <li key={"subcategory" + i} className="expertSuggestions-subcategory">
                                        <p className="expertSuggestions-subcategory-heading">
                                            {key}
                                        </p>
                                        <ul className='content list-disc'>
                                            {props.expert_suggestions.categorised[key].map((data, index) => {
                                                return (
                                                    <li key={"subcategory" + index + "content"}>
                                                        {data}
                                                    </li>
                                                )
                                            })
                                            }
                                        </ul>
                                    </li>
                                )
                            })
                            }
                        </ul>
                    </>
                    )}
            </div>

        </section>
    );
};
export default Keypoints;