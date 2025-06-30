
import type { APIRoute } from 'astro';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: import.meta.env.NOTION_API_KEY });
const databaseId = import.meta.env.NOTION_DATABASE_ID;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      company, 
      role, 
      currentSituation, 
      urgency, 
      situation, 
      pattern, 
      patternOther 
    } = body;

    // Basic validation
    if (!name || !email || !company || !situation) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    try {
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          // NOTE: These property names must match your Notion database columns exactly.
          'Name': {
            title: [{ text: { content: name } }],
          },
          'Email': {
            email: email,
          },
          'Company': {
            rich_text: [{ text: { content: company || '' } }],
          },
          'Role': {
            rich_text: [{ text: { content: role || '' } }],
          },
          'Current Situation': {
            select: { name: currentSituation },
          },
          'Urgency': {
            select: { name: urgency },
          },
          'Situation': {
            rich_text: [{ text: { content: situation || '' } }],
          },
          'Pattern': {
            select: { name: pattern },
          },
          'Pattern (Other)': {
            rich_text: [{ text: { content: patternOther || '' } }],
          },
        },
      });

      return new Response(JSON.stringify({ message: "Success!" }), { status: 200 });
    } catch (error) {
      console.error("Notion API Error:", error);
      return new Response(JSON.stringify({ message: "There was an error submitting to Notion." }), { status: 500 });
    }
  } catch (error) {
    console.error("Request Body Error:", error);
    return new Response(JSON.stringify({ message: "Error processing request body. Is it valid JSON?" }), { status: 400 });
  }
};
