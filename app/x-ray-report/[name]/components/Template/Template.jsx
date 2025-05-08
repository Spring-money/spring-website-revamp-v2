'use client';

import Header from "../Header/Header";
import './Template.css'
import Keypoints from "../Keypoints/Keypoints";
import Rating from "../Rating/Rating";
import Explore from "../Explore/Explore";
export default function Template(props){

    let score=0;
    const current_analysis=[];
    const scope_of_improvement=[];
    const expert_suggestions={uncategorised:[],categorised:{}};
    const explore={};
   
    if('health_check_summary_table' in props.data){
        props.data.health_check_summary_table.map((d)=>{if(d.category==props.children){
            if(d.summary_type=="GOOD" && d.short_summary!=""){
                current_analysis.push(d.short_summary);
            }
            else if(d.summary_type=="BAD" && d.short_summary!=""){
                scope_of_improvement.push(d.short_summary);
            }
            if('detailed_summary' in d){
                if(d.sub_category!=""){
                    if(d.sub_category in expert_suggestions.categorised){
                        if("image_url" in d){
                            if("image_url_heading" in d){
                                expert_suggestions.categorised[d.sub_category]=[...expert_suggestions.categorised[d.sub_category],[d.detailed_summary,d.image_url,d.image_url_heading]];
                            }
                            else{
                                expert_suggestions.categorised[d.sub_category]=[...expert_suggestions.categorised[d.sub_category],[d.detailed_summary,d.image_url,""]];
                            }
                        }else{
                            expert_suggestions.categorised[d.sub_category]=[...expert_suggestions.categorised[d.sub_category],[d.detailed_summary,"",""]];
                        }
                    }else{
                        if("image_url" in d){
                            if("image_url_heading" in d ){
                                expert_suggestions.categorised[d.sub_category]=[[d.detailed_summary,d.image_url,d.image_url_heading]];
                            }
                            else{
                                expert_suggestions.categorised[d.sub_category]=[[d.detailed_summary,d.image_url,""]];
                            }
                        }else{
                            expert_suggestions.categorised[d.sub_category]=[[d.detailed_summary,"",""]];
                        }
                    }
                }else{
                    if("image_url" in d){
                        if("image_url_heading" in d){
                            expert_suggestions.uncategorised.push([d.detailed_summary,d.image_url,d.image_url_heading]);
                        }
                        else{
                            expert_suggestions.uncategorised.push([d.detailed_summary,d.image_url,""]);
                        }
                    }else{
                        expert_suggestions.uncategorised.push([d.detailed_summary,"",""]);
                    }
                }
            }
        }})
    
        props.data.health_check_score_table.map((d)=>{if(d.category==props.children){
            score=d.score;
        }})
    }

    console.log(props.children,expert_suggestions)

    return (
        <div className="Template">
            <Header>{props.children}</Header>
            <Rating score={score} category={props.children}></Rating>
            <Keypoints current_analysis={current_analysis} expert_suggestions={expert_suggestions} scope_of_improvement={scope_of_improvement}>{props.children}</Keypoints>
            <Explore explore={explore}></Explore>
            <div className="Template-line"></div>
        </div>
    )
}

