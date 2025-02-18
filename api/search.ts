export const config = {
  runtime: 'edge',
};

interface SearchResult {
  metadata: {
    title: string;
    university: string;
    description: string;
    patents: string;
    llm_summary: string;
    llm_teaser: string;
  };
  score: number;
}

export default async function handler(req: Request) {
  try {
    const { query } = await req.json();
    console.log('Query received:', query);
    
    // 1. Generate embedding
    console.log('Fetching embedding...');
    const embeddingResponse = await fetch('https://api.pinecone.io/embed', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.PINECONE_API_KEY!,
        'Content-Type': 'application/json',
        'X-Pinecone-API-Version': '2024-10'
      },
      body: JSON.stringify({
        model: 'multilingual-e5-large',
        parameters: {
          input_type: 'passage',
          truncate: 'END'
        },
        inputs: [{ text: query }]
      })
    });
    
    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      throw new Error(`Embedding API error: ${errorText}`);
    }

    const embedding = await embeddingResponse.json();
    console.log('Embedding received');
    
    // 2. Query Pinecone
    console.log('Querying Pinecone...');
    const searchResponse = await fetch(`https://${process.env.PINECONE_HOSTNAME}/query`, {
      method: 'POST',
      headers: {
        'Api-Key': process.env.PINECONE_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        namespace: 'tech_transfer',
        vector: embedding.data[0].values,
        topK: 20,
        includeValues: false,
        includeMetadata: true
      })
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      throw new Error(`Pinecone search error: ${errorText}`);
    }

    const results = await searchResponse.json();
    console.log('Search results received');
    
    return new Response(JSON.stringify({ 
      success: true,
      results: results.matches.map((match: SearchResult) => ({
        title: match.metadata.title,
        university: match.metadata.university,
        description: match.metadata.description,
        patents: match.metadata.patents,
        llm_summary: match.metadata.llm_summary,
        llm_teaser: match.metadata.llm_teaser,
        score: match.score
      }))
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Detailed error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Failed request",
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 