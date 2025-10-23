1  "use client";
2  
3  import { useState } from "react";
4  import Link from "next/link";
5  import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
6  
7  export default function Page() {
8    // State hooks
9    const [customNeed, setCustomNeed] = useState("");
10   const [myRole, setMyRole] = useState("Founder");
11   const [aiRole, setAiRole] = useState("Copywriter");
12   const [audience, setAudience] = useState("Prospective Customers");
13   const [outputFormat, setOutputFormat] = useState("Email");
14   const [length, setLength] = useState("Short (100–200 words)");
15   const [style, setStyle] = useState("Persuasive");
16   const [tone, setTone] = useState("Confident");
17   const [depth, setDepth] = useState("Standard"); // NEW
18   const [constraints, setConstraints] = useState("");
19   const [feedbackOpen, setFeedbackOpen] = useState(false);
20   const [feedbackText, setFeedbackText] = useState("");
21   const [rating, setRating] = useState(0);
22  
23   // ✅ Only declare once
24   const session = useSession();
25   const supabase = useSupabaseClient();
26  
27   // Advanced toggles
28   const [seoFriendly, setSeoFriendly] = useState(false);
29   const [includeReferences, setIncludeReferences] = useState(false);
30   const [structuredOutput, setStructuredOutput] = useState(false);
31   const [avoidPitfalls, setAvoidPitfalls] = useState(false);
32   const [complianceMode, setComplianceMode] = useState(false);
33  
34   // Generated prompt state
35   const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
36  
37   // NEW state for linking feedback to a saved prompt
38   const [promptId, setPromptId] = useState<string | null>(null);
39  
40   // Test prompt state
41   const [isTesting, setIsTesting] = useState(false);
42   const [testOutput, setTestOutput] = useState("");
43  
44   // Options
45   const myRoleOptions = [
46     "Founder","CEO / Executive","HR Manager","Recruiter / Talent Partner",
47     "Product Manager","Project Manager","Sales Lead / AE","Customer Success",
48     "Marketing Manager","Content Creator","Educator / Trainer","Student",
49     "Researcher / Analyst","Operations Manager","Engineer (Non-ML)"
50   ];
51  
52   const aiRoleOptions = [
53     "Copywriter","Editor","Strategist","Analyst","Researcher","Recruiter","Tutor",
54     "Assistant","Summarizer","Planner","Scriptwriter","UX Writer","Technical Writer",
55     "Email Composer","Social Media Manager"
56   ];
57  
58   const audienceOptions = [
59     "General Public","Prospective Customers","Existing Customers","Executives","Managers",
60     "Employees","Partners","Investors","Students","Practitioners / Peers"
61   ];
62  
63   const outputFormatOptions = [
64     "Email","Blog Post","LinkedIn Post","Tweet Thread","Report","Brief / One-pager",
65     "Slide Outline","Product Spec","FAQ","Press Release","Case Study","User Story",
66     "Job Description","Interview Questions","Checklist"
67   ];
68  
69   const lengthOptions = [
70     "Very short (50–100 words)","Short (100–200 words)","Medium (300–500 words)",
71     "Long (800–1200 words)","Extended (1500+ words)"
72   ];
73  
74   const styleOptions = [
75     "Formal","Casual","Persuasive","Storytelling","Technical","Analytical",
76     "Instructional","Conversational","Executive-ready","Bullet-heavy"
77   ];
78  
79   const toneOptions = [
80     "Neutral","Friendly","Confident","Empathetic","Direct","Inspirational","Data-driven","Urgent"
81   ];
82  
83   const depthOptions = [ // NEW
84     "Brief","Standard","Deep Dive"
85   ];
86  
87   // Helper to build the payload
88   function buildPayload() {
89     return {
90       customNeed,
91       persona: myRole,
92       role: aiRole,
93       audience,
94       outputFormat,
95       length,
96       style,
97       tone,
98       depth, // NEW
99       constraints,
100      advanced: {
101        seoFriendly,
102        includeReferences,
103        structuredOutput,
104        avoidPitfalls,
105        complianceMode,
106      },
107      generatedPrompt,
108    };
109  }
110
111  // Handlers
112  async function handleSave() { … }
113  async function handleShare() { … }
114  function handleCopyPrompt() { … }
115  function handleDownloadPrompt() { … }
116  async function handleFeedback(e: React.MouseEvent) { … }
117  async function handleGeneratePrompt(e: React.FormEvent) { … }
118
119  return (
120    <main className="mx-auto max-w-3xl px-4 py-8">
121     <div className="flex items-center justify-between mb-6">
122       <h1 className="text-2xl font-semibold">PromptAlpha</h1>
123     </div>
124
125     <form onSubmit={handleGeneratePrompt}>
126       {/* Custom Need */}
127       <div className="mb-6">
128         <label htmlFor="customNeed" className="block text-sm font-medium text-gray-700">
129           What do you need?
130         </label>
131         <textarea
132           id="customNeed"
133           rows={2}
134           value={customNeed}
135           onChange={(e) => setCustomNeed(e.target.value)}
136           className="mt-1 block w-full rounded-md border border-gray-300 p-2"
137           placeholder="E.g., Write a LinkedIn post about our new product launch"
138         />
139       </div>
140
141       {/* Context group */}
142       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
143         <div>
144           <label htmlFor="myRole" className="block text-sm font-medium text-gray-700">
145             My Role
146           </label>
147           <select
148             id="myRole"
149             value={myRole}
150             onChange={(e) => setMyRole(e.target.value)}
151             className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
152           >
153             {myRoleOptions.map((opt) => (
154               <option key={opt} value={opt}>{opt}</option>
155             ))}
156           </select>
157         </div>
158
159         <div>
160           <label htmlFor="aiRole" className="block text-sm font-medium text-gray-700">
161             AI Role
162           </label>
163           <select
164             id="aiRole"
165             value={aiRole}
166             onChange={(e) => setAiRole(e.target.value)}
167             className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
168           >
169             {aiRoleOptions.map((opt) => (
170               <option key={opt} value={opt}>{opt}</option>
171             ))}
172           </select>
173         </div>
174
175         <div>
176           <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
177             Audience
178           </label>
179           <select
180             id="audience"
181             value={audience}
182             onChange={(e) => setAudience(e.target.value)}
183             className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
184           >
185             {audienceOptions.map((opt) => (
186               <option key={opt} value={opt}>{opt}</option>
187             ))}
188           </select>
189         </div>
190       </div>
191
192       {/* Output group */}
193       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
194         <div>
195           <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700">
196             Output Format
197           </label>
198           <select
199             id="outputFormat"
200             value={outputFormat}
201             onChange={(e) => setOutputFormat(e.target.value)}
202             className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
203           >
204             {outputFormatOptions.map((opt) => (
205               <option key={opt} value={opt}>{opt}</option>
206             ))}
207           </select>
208         </div>
209
210         <div>
211           <label htmlFor="length" className="block text-sm font-medium text-gray-700">
212             Length
213           </label>
214           <select
215             id="length"
216             value={length}
217             onChange={(e) => setLength(e.target.value)}
218             className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
219           >
220             {lengthOptions.map((opt) => (
221             {lengthOptions.map((opt) => (
222               <option key={opt} value={opt}>{opt}</option>
223             ))}
224           </select>
225         </div>
226
227         <div>
228           <label htmlFor="style" className="block text-sm font-medium text-gray-700">
229             Style
230           </label>
231           <select
232             id="style"
233             value={style}
234             onChange={(e) => setStyle(e.target.value)}
235             className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
236           >
237             {styleOptions.map((opt) => (
238               <option key={opt} value={opt}>{opt}</option>
239             ))}
240           </select>
241         </div>
242
243         <div>
244           <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
245             Tone
246           </label>
247           <select
248             id="tone"
249             value={tone}
250             onChange={(e) => setTone(e.target.value)}
251             className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
252           >
253             {toneOptions.map((opt) => (
254               <option key={opt} value={opt}>{opt}</option>
255             ))}
256           </select>
257         </div>
258
259         <div>
260           <label htmlFor="depth" className="block text-sm font-medium text-gray-700">
261             Depth
262           </label>
263           <select
264             id="depth"
265             value={depth}
266             onChange={(e) => setDepth(e.target.value)}
267             className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white"
268           >
269             {depthOptions.map((opt) => (
270               <option key={opt} value={opt}>{opt}</option>
271             ))}
272           </select>
273         </div>
274       </div>
275
276       {/* Constraints */}
277       <div className="mb-6">
278         <label htmlFor="constraints" className="block text-sm font-medium text-gray-700">
279           Constraints (optional)
280         </label>
281         <textarea
282           id="constraints"
283           rows={3}
284           value={constraints}
285           onChange={(e) => setConstraints(e.target.value)}
286           className="mt-1 block w-full rounded-md border border-gray-300 p-2"
287           placeholder="E.g., 200–300 words, include a CTA, avoid jargon, use bullet points."
288         />
289       </div>
290
291       {/* Advanced options */}
292       <details className="mb-6">
293         <summary className="cursor-pointer font-medium">Advanced options</summary>
294         <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
295           <label className="flex items-center gap-2">
296             <input type="checkbox" checked={seoFriendly} onChange={(e) => setSeoFriendly(e.target.checked)} />
297             <span>SEO friendly</span>
298           </label>
299           <label className="flex items-center gap-2">
300             <input type="checkbox" checked={includeReferences} onChange={(e) => setIncludeReferences(e.target.checked)} />
301             <span>Include references</span>
302           </label>
303           <label className="flex items-center gap-2">
304             <input type="checkbox" checked={structuredOutput} onChange={(e) => setStructuredOutput(e.target.checked)} />
305             <span>Structured output</span>
306           </label>
307           <label className="flex items-center gap-2">
308             <input type="checkbox" checked={avoidPitfalls} onChange={(e) => setAvoidPitfalls(e.target.checked)} />
309             <span>Avoid pitfalls (jargon, fluff)</span>
310           </label>
311           <label className="flex items-center gap-2">
312             <input type="checkbox" checked={complianceMode} onChange={(e) => setComplianceMode(e.target.checked)} />
313             <span>Compliance mode (conservative claims)</span>
314           </label>
315         </div>
316       </details>
317
318       {/* Actions */}
319       <div className="flex flex-wrap items-center gap-3">
320         <button type="submit" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
321           Generate Prompt
322         </button>
323
324         <button
325           type="button"
326           onClick={handleSave}
327           className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
328           disabled={!generatedPrompt}
329           title={!generatedPrompt ? "Generate a prompt first" : ""}
330         >
331           Save
332         </button>
333
334         <button
335           type="button"
336           onClick={handleShare}
337           className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
338           disabled={!generatedPrompt}
339           title={!generatedPrompt ? "Generate a prompt first" : ""}
340         >
341           Share
342         </button>
343
344         {!feedbackOpen ? (
345           <button
346             type="button"
347             onClick={() => setFeedbackOpen(true)}
348             className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
349             disabled={!generatedPrompt}
350             title={!generatedPrompt ? "Generate a prompt first" : ""}
351           >
352             Give feedback
353           </button>
354         ) : (
355           <div className="border rounded-md p-3 space-y-2">
356             <textarea
357               placeholder="Your feedback..."
358               value={feedbackText}
359               onChange={(e) => setFeedbackText(e.target.value)}
360               className="w-full border rounded-md p-2"
361             />
362             <div className="flex space-x-2">
363               {[1, 2, 3, 4, 5].map((star) => (
364                 <button
365                   key={star}
366                   type="button"
367                   onClick={() => setRating(star)}
368                   className={`px-2 py-1 border rounded-md ${rating === star ? "bg-gray-200 font-bold" : ""}`}
369                 >
370                   {star}
371                 </button>
372               ))}
373             </div>
374             <div className="flex space-x-2">
375               <button
376                 type="button"
377                 onClick={handleFeedback}
378                 className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
379               >
380                 Submit Feedback
381               </button>
382               <button
383                 type="button"
384                 onClick={() => {
385                   setFeedbackOpen(false);
386                   setFeedbackText("");
387                   setRating(0);
388                 }}
389                 className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
390               >
391                 Cancel
392               </button>
393             </div>
394           </div>
395         )}
396       </div>
397     </form>
398
399     {/* Generated prompt output */}
400     {generatedPrompt && (
401       <div className="mt-8 rounded-md border border-gray-200 p-4 bg-gray-50">
402         <h2 className="text-lg font-semibold mb-2">Generated Prompt</h2>
403         <pre className="whitespace-pre-wrap text-sm">{generatedPrompt}</pre>
404
405         <div className="mt-4 flex flex-wrap gap-3">
406           <button
407             type="button"
408             onClick={handleCopyPrompt}
409             className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-100"
410           >
411             Copy
412           </button>
413           <button
414             type="button"
415             onClick={handleDownloadPrompt}
416             className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-100"
417           >
418             Download
419           </button>
420         </div>
421
422         {/* Why this is a super prompt */}
423         <div className="mt-6 p-4 border rounded bg-white">
424           <h3 className="text-lg font-semibold mb-2">Why this is a super prompt</h3>
425           <p className="text-sm text-gray-700">This prompt was enhanced by:</p>
426           <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
427             <li>Adding clear role/context instructions (e.g. “Act as a …”).</li>
428             <li>Specifying output format, tone, and depth for consistency.</li>
429             <li>Breaking down the task into structured steps.</li>
430             <li>Including constraints to avoid vague or generic answers.</li>
431             <li>Optimizing wording for LLM interpretability.</li>
432           </ul>
433           <p className="text-sm text-gray-700 mt-2">
434             Compared to a regular prompt, this “super prompt” is explicit, structured, and reusable.
435           </p>
436         </div>
437
438         {/* Test Prompt button + output */}
439         <div className="mt-6">
440           <button
441             type="button"
442             onClick={async () => {
443               setIsTesting(true);
444               setTestOutput("");
445               try {
446                 const res = await fetch("/api/testPrompt", {
447                   method: "POST",
448                   headers: { "Content-Type": "application/json" },
449                   body: JSON.stringify({ prompt: generatedPrompt }),
450                 });
451                 const data = await res.json();
452                 setTestOutput(data.output);
453               } catch (err) {
454                 setTestOutput("Error testing prompt.");
455               } finally {
456                 setIsTesting(false);
457               }
458             }}
459             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
460           >
461             Test Prompt
462           </button>
463
464           {isTesting && <p className="mt-2 text-sm text-gray-500">Running prompt...</p>}
465
466           {testOutput && (
467             <div className="mt-4 p-4 border rounded bg-white">
468               <h3 className="text-lg font-semibold mb-2">Test Output</h3>
469               <pre className="whitespace-pre-wrap text-sm text-gray-800">
470                 {testOutput}
471               </pre>
472             </div>
473           )}
474         </div>
475       </div>
476     )}
477   </main>
478 );
}
