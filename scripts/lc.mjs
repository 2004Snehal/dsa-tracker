// LeetCode GraphQL client for the sync scripts.
// LEETCODE_SESSION / LEETCODE_CSRF are optional; without them only public queries work.
export const authed = Boolean(process.env.LEETCODE_SESSION);
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function gql(query, variables = {}) {
  const { LEETCODE_SESSION, LEETCODE_CSRF = "" } = process.env;
  const headers = {
    "content-type": "application/json",
    referer: "https://leetcode.com/",
    origin: "https://leetcode.com",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  };
  if (LEETCODE_SESSION) {
    headers["x-csrftoken"] = LEETCODE_CSRF;
    headers.cookie = `LEETCODE_SESSION=${LEETCODE_SESSION}; csrftoken=${LEETCODE_CSRF}`;
  }
  const res = await fetch("https://leetcode.com/graphql/", { method: "POST", headers, body: JSON.stringify({ query, variables }) });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  const json = JSON.parse(text);
  if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 500));
  return json.data;
}

const RECENT = `query r($username: String!, $limit: Int!) {
  recentAcSubmissionList(username: $username, limit: $limit) { titleSlug timestamp }
}`;
const QUESTION = `query q($titleSlug: String!) {
  question(titleSlug: $titleSlug) { questionFrontendId title difficulty topicTags { slug } }
}`;
const PROGRESS = `query p($filters: UserProgressQuestionListInput) {
  userProgressQuestionList(filters: $filters) { totalNum questions { titleSlug questionStatus } }
}`;
const SUBS = `query s($questionSlug: String!, $offset: Int!, $limit: Int!) {
  questionSubmissionList(questionSlug: $questionSlug, offset: $offset, limit: $limit) {
    hasNext submissions { id statusDisplay timestamp }
  }
}`;
const DETAIL = `query d($id: Int!) {
  submissionDetails(submissionId: $id) { code lang { name } runtimeDisplay memoryDisplay }
}`;

export async function recentAccepted(username) {
  return (await gql(RECENT, { username, limit: 20 })).recentAcSubmissionList;
}

export async function question(slug) {
  return (await gql(QUESTION, { titleSlug: slug })).question;
}

/** Every solved slug. Needs auth. */
export async function solvedSlugs() {
  const out = [];
  for (let skip = 0; ; skip += 50) {
    const r = (await gql(PROGRESS, { filters: { skip, limit: 50 } })).userProgressQuestionList;
    out.push(...r.questions.filter((q) => q.questionStatus === "SOLVED").map((q) => q.titleSlug));
    if (skip + 50 >= r.totalNum || r.questions.length === 0) return out;
    await sleep(300);
  }
}

/** All submissions for one problem, any verdict. Needs auth. */
export async function submissions(slug) {
  const out = [];
  for (let offset = 0; ; offset += 20) {
    const r = (await gql(SUBS, { questionSlug: slug, offset, limit: 20 })).questionSubmissionList;
    out.push(...r.submissions);
    if (!r.hasNext) return out;
    await sleep(300);
  }
}

export async function submissionDetail(id) {
  const d = (await gql(DETAIL, { id: Number(id) })).submissionDetails;
  return { submissionId: String(id), lang: d.lang.name, code: d.code, runtime: d.runtimeDisplay, memory: d.memoryDisplay };
}
