const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

export async function runPipeline(caseData) {
  const response = await fetch(`${AI_ENGINE_URL}/pipeline/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(caseData),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI engine error: ${response.status} ${text}`);
  }

  return response.json();
}
