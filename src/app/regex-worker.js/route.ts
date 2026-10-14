// Serve the regex worker from application source so public/ can stay empty.
export const dynamic = "force-static";

export function GET() {
  return new Response("self.onmessage = ({data}) => {\n try {\n  if(data.text.length > 10000 || data.pattern.length > 200) throw Error('Use up to 10,000 text characters and a 200-character pattern.');\n  const flags=data.flags.includes('g')?data.flags:data.flags+'g';\n  const matches=Array.from(data.text.matchAll(new RegExp(data.pattern,flags))).slice(0,500);\n  self.postMessage({result:matches.length?matches.map(m=>`Position ${m.index}: ${m[0]}`).join('\\n'):'No matches.'});\n } catch(e) {self.postMessage({error:e.message});}\n};\n", {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
