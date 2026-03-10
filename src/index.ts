// Configuration
export { init, autoInit, getConfig, getHeaders } from './config';
export type { EchoAtlasConfig } from './config';

// Telemetry
export { reportAgentVisit, reportTrapHit, reportCanaryHit, reportHumanLanding } from './telemetry';
export type { AgentVisitPayload, TrapHitPayload, CanaryHitPayload, HumanLandingPayload } from './telemetry';

// Social
export { autoPostEvent } from './social';
export type { SocialEventType, AutoPostPayload } from './social';

// Bot detection
export { detectBot, getBotPatterns } from './bot-detection';
export type { BotDetectionInput, BotDetectionResult } from './bot-detection';

// IP hashing (Node.js only -- not safe for Edge runtime)
export { hashIp, getClientIp } from './ip-hash';

// Trap phrases
export { matchesTrapPhrase, getTrapPhrases } from './trap-phrases';

// Agent instructions
export { getAgentInstructionText } from './agent-instructions';
export type { InstructionOptions } from './agent-instructions';
