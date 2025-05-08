export async function GET() {
    try {
      const response = await fetch("https://www.wixapis.com/blog/v3/posts", {
        method: "GET",
        headers: {
          Authorization:
            "IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjA0NWNlMThjLWUzZDAtNDM2MC05ZTdmLTlmYjk5ZTliYTNiZVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImE4YWYwY2QzLWU2YjUtNGYxYy05ZTg0LWNmYTA3NzExZTRiOFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCJhZGFkMjcxMi1lZjI3LTQxNzktYTJkNy0wODY4OTliYjE2MGFcIn19IiwiaWF0IjoxNjc1MjM3MjM2fQ.D60xTDpiJs09yvDSBnfG4AHhVtHciZLvSCqtVo2vRF3nN4yZ9Ak68VUeFZAg-uBnDTpMZ8RWCyXAYzInMkSZvvz3XOf615IMOoO3vUQZ5g4mKfskzn3Kj3CFM_JI2K2u9g8TeoMeAxm-TcXXotji_oiP36d4BvjK9srYhKcWumqR9WbpnCLQlbpqfI2VFTibNZ7MFxl4m7iRjnhzRyZbJwY2XTqYrmcscQHj7Sp2Fqq26_0XFucRFKr4BVg3OYQiMoCVebO0p1kwRYhI6E1tdydeyZLOy-TJOashdXxVjTjOTH_gGDgVs1pTonggE6whVze1a8Mv93ooI9C0uHOesw",
          "wix-account-id": "adad2712-ef27-4179-a2d7-086899bb160a",
          "wix-site-id": "d64d7caf-961f-433a-bc59-e3d5ac1d422f",
        },
      });
      if (!response.ok) {
        console.log("error occures while fetching all blogs posts...");
      }
      const data = await response.json();
  
      // Add cache control headers to the response
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
