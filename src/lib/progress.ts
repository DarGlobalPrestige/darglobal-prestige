/** Progress computation for applicant journey */

const DOC_STATUS_KEY = "darglobal_doc_status";
const DOCS_SUBMITTED_KEY = "darglobal_docs_submitted";
const AGREEMENT_KEY = "darglobal_agreement";

export interface ProgressData {
  percent: number;
  milestones: Milestone[];
  currentStep: string;
  nextAction: string;
}

export interface Milestone {
  id: string;
  label: string;
  icon: string;
  done: boolean;
  inProgress?: boolean;
}

export function getProgress(email: string): ProgressData {
  const docStatus = loadDocStatus(email);
  const docsSubmitted = loadDocsSubmitted(email);
  const agreementComplete = loadAgreementComplete(email);

  const docsDone = Object.values(docStatus).filter((s) => s === "uploaded").length;
  const docsCount = 4;

  const milestones: Milestone[] = [
    {
      id: "application",
      label: "Application",
      icon: "📝",
      done: true,
    },
    {
      id: "documentation",
      label: "Documentation",
      icon: "📁",
      done: docsSubmitted,
      inProgress: !docsSubmitted && docsDone > 0,
    },
    {
      id: "review",
      label: "Review",
      icon: "🔍",
      done: docsSubmitted,
      inProgress: docsSubmitted && !agreementComplete,
    },
    {
      id: "agreement",
      label: "Agreement",
      icon: "📜",
      done: agreementComplete,
      inProgress: docsSubmitted && !agreementComplete,
    },
    {
      id: "ready",
      label: "Ready",
      icon: "✅",
      done: agreementComplete,
    },
  ];

  // Application 20% + Documentation 40% + Agreement 40% = 100%
  let percent = 20; // Application always done
  if (docsSubmitted) {
    percent += 40; // Documentation complete
  } else {
    percent += Math.round((docsDone / docsCount) * 40);
  }
  if (agreementComplete) {
    percent += 40;
  }
  percent = Math.min(100, percent);

  let currentStep = "Complete documentation";
  let nextAction = "Upload 4 required documents";

  if (docsSubmitted && !agreementComplete) {
    currentStep = "Sign agreement";
    nextAction = "Complete investor agreement & bank details";
  } else if (agreementComplete) {
    currentStep = "All complete";
    nextAction = "Explore opportunities";
  } else if (docsDone > 0) {
    currentStep = `${docsDone}/4 documents uploaded`;
    nextAction = `Upload ${docsCount - docsDone} more`;
  }

  return { percent, milestones, currentStep, nextAction };
}

function loadDocStatus(email: string): Record<string, "pending" | "uploaded"> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(`${DOC_STATUS_KEY}_${email}`);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, "pending" | "uploaded">;
      return parsed;
    }
  } catch {}
  return {};
}

function loadDocsSubmitted(email: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(`${DOCS_SUBMITTED_KEY}_${email}`) === "true";
  } catch {}
  return false;
}

function loadAgreementComplete(email: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(`${AGREEMENT_KEY}_${email}`);
    return !!raw;
  } catch {}
  return false;
}
