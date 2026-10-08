/*
 * Sanjeevani General Hospital — Patient Data Analysis
 * Extracted from the original uploaded single-file dashboard.
 *
 * The dataset and dashboard calculations remain the original synthetic
 * 64-patient implementation.
 */

// Synthetic dataset: department counts, status totals match the original dashboard (64 patients, 41 admitted, 15 critical).
let s=11;const R=()=>(s=s*16807%2147483647)/2147483647,pick=a=>a[Math.floor(R()*a.length)];
const DEPT={Cardiology:[13,['Arrhythmia','Angina','Heart Failure'],['Menon','Rao','Bhat'],42000],Orthopedics:[13,['Knee Osteoarthritis','Lower Back Pain','Fracture'],['Fernandes','Menon'],58000],Pediatrics:[6,['Bronchiolitis','Asthma'],['Naik'],14000],'General Medicine':[8,['Dengue','Typhoid','Pneumonia'],['Kulkarni','Bhat','Fernandes'],18000],Neurology:[13,['Stroke - Ischemic','Migraine','Epilepsy'],['Shaikh','Menon'],52000],ENT:[11,['Otitis Media','Sinusitis','Tonsillitis'],['Menon','Bhat'],16000]};
const P=[];Object.entries(DEPT).forEach(([d,[n,ds,dr,b]])=>{for(let i=0;i<n;i++){const los=1+Math.floor(R()*30);P.push({d,dx:pick(ds),dr:'Dr. '+pick(dr),los,cost:Math.round(b*(.6+R()*.9)*(1+los/25)/100)*100})}});
const st=[...Array(15).fill('Critical'),...Array(26).fill('Admitted'),...Array(23).fill('Discharged')];
P.sort(()=>R()-.5);P.forEach((p,i)=>{p.st=st[i];p.pay=p.st==='Discharged'?(R()<.8?'Paid':'Pending'):pick(['Insurance claim','Pending','Paid','Insurance claim'])});
const CL=['--c1','--c2','--c3','--c4','--c5','--c6'].map(c=>`var(${c})`);
const grp=(k)=>{const o={};P.forEach(p=>o[p[k]]=(o[p[k]]||0)+1);return Object.entries(o).sort((a,b)=>b[1]-a[1])};
const sum=a=>a.reduce((x,y)=>x+y,0),inr=n=>'₹'+Math.round(n).toLocaleString('en-IN'),lakh=n=>'₹'+(n/1e5).toFixed(1)+'L';
const kpi=(l,v,n)=>`<div class="kpi"><small>${l}</small><div class="big">${v}</div><small>${n}</small></div>`;
const hb=(e,f=x=>x,col='')=>{const m=Math.max(...e.map(x=>x[1]));return e.map(([k,v],i)=>`<div class="hb"><span>${k}</span><i style="width:${v/m*100}%;${col?'background:'+col:''}"></i><span>${f(v)}</span></div>`).join('')};
const cols=(e,f=x=>x)=>{const m=Math.max(...e.map(x=>x[1]));return `<div class="cols">${e.map(([k,v])=>`<div class="col">${f(v)}<i style="height:${v/m*85}%"></i></div>`).join('')}</div><div class="lbls">${e.map(x=>`<span>${x[0]}</span>`).join('')}</div>`};
const pie=e=>{const t=sum(e.map(x=>x[1]));let a=0;const g=e.map(([k,v],i)=>{const s=a;a+=v/t*100;return `${CL[i%6]} ${s}% ${a}%`});return `<div class="pie"><div class="p" style="background:conic-gradient(${g})"></div><div class="leg">${e.map(([k,v],i)=>`<div><b style="background:${CL[i%6]}"></b>${k} (${v})</div>`).join('')}</div></div>`};
const card=(t,b)=>`<div class="card"><h3>${t}</h3>${b}</div>`;
const total=sum(P.map(p=>p.cost)),avgC=total/P.length,avgL=sum(P.map(p=>p.los))/P.length;
const adm=P.filter(p=>p.st!=='Discharged').length,crit=P.filter(p=>p.st==='Critical').length;
const K=()=>`<div class="kpis">${kpi('Total Patients',P.length,'last 75 days')}${kpi('Currently Admitted',adm,Math.round(adm/50*100)+'% bed occupancy')}${kpi('Critical Cases',crit,'require close monitoring')}${kpi('Avg. Length of Stay',avgL.toFixed(1)+' <span>days</span>','across all departments')}</div>`;
const by=(k,fn)=>{const o={};P.forEach(p=>(o[p[k]]=o[p[k]]||[]).push(p));return Object.entries(o).map(([n,a])=>[n,fn(a)])};
const docs=by('dr',a=>({n:a.length,dep:[...new Set(a.map(x=>x.d))].join(', '),rev:sum(a.map(x=>x.cost)),los:sum(a.map(x=>x.los))/a.length})).sort((a,b)=>b[1].n-a[1].n);
const dis=grp('dx'),dept=grp('d');
const pages={
home:()=>`<div class="hero"><h1>Sanjeevani General Hospital</h1><p>Patient Data Analysis System. A single view of who we treat, which diseases drive admissions, and where the money goes, drawn from ${P.length} patient records over the last 75 days.</p></div>${K()}
<div class="grid">${[['doctors','Doctor Analysis','Patients treated and workload per doctor'],['diseases','Disease Analysis','Most common conditions and their spread'],['finance','Financial Analysis','Treatment cost, revenue and payment status'],['reports','Reports','Key findings, tables and insights']].map(([h,t,d])=>`<a class="card tile" href="#${h}"><h3 style="font-size:17px;font-family:Fraunces,Georgia,serif;font-weight:500">${t}</h3><p>${d}</p></a>`).join('')}</div>`,
doctors:()=>`<h1>Doctor Analysis</h1><p class="sub">Caseload and department coverage by doctor.</p>
<div class="grid">${card('Patients Treated by Doctor',hb(docs.map(([n,o])=>[n,o.n]),x=>x,'var(--c1)'))}${card('Patient Distribution by Doctor',pie(docs.map(([n,o])=>[n,o.n])))}</div>
${card('Doctor Summary',`<div class="tw"><table><tr><th>Doctor</th><th>Department</th><th>Patients</th><th>Avg. stay</th><th>Revenue</th></tr>${docs.map(([n,o])=>`<tr><td><b>${n}</b></td><td>${o.dep}</td><td>${o.n}</td><td>${o.los.toFixed(1)}d</td><td>${lakh(o.rev)}</td></tr>`).join('')}</table></div>`)}`,
diseases:()=>`<h1>Disease Analysis</h1><p class="sub">Disease-wise patient counts across all departments.</p>
<div class="grid">${card('Top 5 Most Common Diseases',hb(dis.slice(0,5),x=>x,'var(--c2)'))}${card('Disease Distribution',pie([...dis.slice(0,5),['Others',sum(dis.slice(5).map(x=>x[1]))]]))}</div>
${card('Disease-wise Patient Count',cols(dis.slice(0,12)))}<br>${card('All Diseases',`<div class="tw"><table><tr><th>Disease</th><th>Patients</th><th>Share</th></tr>${dis.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td><td>${(v/P.length*100).toFixed(1)}%</td></tr>`).join('')}</table></div>`)}`,
finance:()=>{const dc=by('d',a=>sum(a.map(x=>x.cost))).sort((a,b)=>b[1]-a[1]),pay=by('pay',a=>sum(a.map(x=>x.cost))),pc=grp('pay'),paid=pay.find(x=>x[0]==='Paid')?.[1]||0;
return `<h1>Financial Analysis</h1><p class="sub">Treatment cost, revenue and payment status. Costs are illustrative sample values.</p>
<div class="kpis">${kpi('Total Revenue',lakh(total),'billed to date')}${kpi('Avg. Treatment Cost',inr(avgC),'per patient')}${kpi('Collected',lakh(paid),Math.round(paid/total*100)+'% of billed')}${kpi('Outstanding',lakh(total-paid),'pending + insurance')}</div>
<div class="grid">${card('Revenue by Department',hb(dc,lakh,'var(--c1)'))}${card('Avg. Treatment Cost by Department',hb(by('d',a=>sum(a.map(x=>x.cost))/a.length).sort((a,b)=>b[1]-a[1]),inr,'var(--c2)'))}
${card('Payment Status (patients)',pie(pc))}${card('Revenue by Payment Status',cols(pay.sort((a,b)=>b[1]-a[1]),lakh))}</div>`},
reports:()=>{const td=dis[0],tdoc=docs[0],dc=by('d',a=>sum(a.map(x=>x.cost))).sort((a,b)=>b[1]-a[1]),ls=by('d',a=>sum(a.map(x=>x.los))/a.length).sort((a,b)=>b[1]-a[1]),pend=P.filter(p=>p.pay==='Pending').length;
return `<h1>Reports</h1><p class="sub">Summary of important findings from the patient data.</p>${K()}
${card('Key Insights',`<ul class="ins"><li><b>${dept[0][0]}</b> and <b>${dept[1][0]}</b> carry the heaviest caseload at ${dept[0][1]} patients each.</li><li>The most common diagnosis is <b>${td[0]}</b> (${td[1]} patients); the top five diseases cover ${Math.round(sum(dis.slice(0,5).map(x=>x[1]))/P.length*100)}% of all cases.</li><li><b>${tdoc[0]}</b> treated the most patients (${tdoc[1].n}), across ${tdoc[1].dep}.</li><li><b>${dc[0][0]}</b> earns the most revenue (${lakh(dc[0][1])}), while <b>${ls[0][0]}</b> has the longest average stay (${ls[0][1].toFixed(1)} days).</li><li>${crit} patients (${Math.round(crit/P.length*100)}%) are critical and need close monitoring; ${pend} accounts are still pending payment.</li></ul>`)}<br>
<div class="grid">${card('Patients by Department',cols(dept))}${card('Avg. Length of Stay (days)',hb(ls,x=>x.toFixed(1),'var(--c3)'))}</div>
${card('Department Summary',`<div class="tw"><table><tr><th>Department</th><th>Patients</th><th>Avg. stay</th><th>Avg. cost</th><th>Revenue</th></tr>${dept.map(([d,n])=>{const a=P.filter(p=>p.d===d);return `<tr><td><b>${d}</b></td><td>${n}</td><td>${(sum(a.map(x=>x.los))/n).toFixed(1)}d</td><td>${inr(sum(a.map(x=>x.cost))/n)}</td><td>${lakh(sum(a.map(x=>x.cost)))}</td></tr>`}).join('')}</table></div>`)}`}
};
const names={home:'Home',doctors:'Doctor Analysis',diseases:'Disease Analysis',finance:'Financial Analysis',reports:'Reports'};
function go(){const h=location.hash.slice(1);const k=pages[h]?h:'home';document.getElementById('m').innerHTML=pages[k]();
document.getElementById('nav').innerHTML=Object.entries(names).map(([i,n])=>`<a href="#${i}" class="${i===k?'on':''}">${n}</a>`).join('');window.scrollTo(0,0)}
addEventListener('hashchange',go);go();
document.getElementById('th').onclick=()=>{const r=document.documentElement,d=r.dataset.theme==='dark'||(!r.dataset.theme&&matchMedia('(prefers-color-scheme:dark)').matches);r.dataset.theme=d?'light':'dark'};
