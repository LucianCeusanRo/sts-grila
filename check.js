global.window={};require('./public/questions.js');
const Q=window.QUESTIONS, by={};let bad=0;const ids=new Set();
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>2);
for(const q of Q){by[q.c]=(by[q.c]||0)+1;if(ids.has(q.id))console.log('DUPID',q.id);ids.add(q.id);if(q.a.length!==4||new Set(q.a).size!==4||!q.q||!q.e){bad++;console.log('BAD',q.id,q.q)}}
const toks=Q.map(q=>new Set(norm(q.q+' '+q.a[0])));const near=[];
for(let i=0;i<Q.length;i++)for(let j=i+1;j<Q.length;j++){const a=toks[i],b=toks[j];let inter=0;a.forEach(w=>{if(b.has(w))inter++});const jac=inter/(a.size+b.size-inter);
 const sameAns=Q[i].a[0].toLowerCase()===Q[j].a[0].toLowerCase();
 if(sameAns&&jac>=0.3)near.push([jac.toFixed(2),Q[i].id,Q[j].id,Q[i].q+' => '+Q[i].a[0],Q[j].q+' => '+Q[j].a[0]]);}
console.log(JSON.stringify(by),'total',Q.length,'bad',bad,'near',near.length);near.forEach(n=>console.log(n.join(' | ')));
