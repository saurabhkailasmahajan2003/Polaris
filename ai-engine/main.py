import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

from pipeline.graph import run_pipeline


class CasePayload(BaseModel):
    caseId: str
    title: str
    description: str
    source: str
    category: str
    participatingAgents: list[str] = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("AI Engine started")
    yield


app = FastAPI(title="Polaris Engine", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-world-engine", "model": os.getenv("MODEL", "claude-sonnet-4-6")}


@app.post("/pipeline/run")
async def pipeline_run(payload: CasePayload, background_tasks: BackgroundTasks):
    case_data = payload.model_dump()

    async def process():
        try:
            result = await run_pipeline(case_data)
            print(f"Pipeline completed for case {case_data['caseId']}")
            return result
        except Exception as e:
            print(f"Pipeline error for case {case_data['caseId']}: {e}")

    background_tasks.add_task(process)
    return {"message": "Pipeline started", "caseId": payload.caseId}
