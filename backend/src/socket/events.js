let io = null;

export function setIO(socketIO) {
  io = socketIO;
}

export function getIO() {
  return io;
}

export function emitCaseStarted(caseData) {
  io?.emit('case:started', caseData);
}

export function emitRoundComplete(payload) {
  io?.emit('case:round_complete', payload);
}

export function emitAgentSpeaking(payload) {
  io?.emit('case:agent_speaking', payload);
}

export function emitVerdictReady(payload) {
  io?.emit('case:verdict_ready', payload);
}

export function emitCityActivity(message) {
  io?.emit('city:activity', { message, timestamp: new Date().toISOString() });
}

/** Fired when admin deploys top-voted posts into the AI world — feed should clear. */
export function emitCasesDeployed(payload) {
  io?.emit('cases:deployed', {
    count: payload?.count || 0,
    caseIds: payload?.caseIds || [],
    message: payload?.message || 'Top posts moved to the AI world',
    timestamp: new Date().toISOString(),
  });
}
