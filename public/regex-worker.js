self.onmessage = ({data}) => {
 try {
  if(data.text.length > 10000 || data.pattern.length > 200) throw Error('Use up to 10,000 text characters and a 200-character pattern.');
  const flags=data.flags.includes('g')?data.flags:data.flags+'g';
  const matches=Array.from(data.text.matchAll(new RegExp(data.pattern,flags))).slice(0,500);
  self.postMessage({result:matches.length?matches.map(m=>`Position ${m.index}: ${m[0]}`).join('\n'):'No matches.'});
 } catch(e) {self.postMessage({error:e.message});}
};
