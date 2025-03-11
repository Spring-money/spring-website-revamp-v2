import { BlogsAllPosts } from "./api_calls/route"
import BlogListingPage from "./blog-listing/page"

export const metadata = {
    title: "Latest Financial Insights & Tips | Spring Money Blog",
    description: "Stay informed with the latest financial insights and tips from Spring Money. Our blog covers topics on investing, saving, retirement planning, and more to help you navigate your financial journey."
}

export default async function (){
    const response = await BlogsAllPosts()

    const data = await response?.json() || []

    return(<BlogListingPage data={data}/>)
}