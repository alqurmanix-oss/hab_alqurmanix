const $=s=>document.querySelector(s);
let S=JSON.parse(localStorage.getItem('aqx')||'{}');
S.day=S.day||1;S.done=S.done||{};S.water=S.water||{};S.gifts=S.gifts||[];S.tasbih=S.tasbih||0;
const save=()=>localStorage.setItem('aqx',JSON.stringify(S));
const pick=(a,d)=>a[(d-1)%a.length];
const TABS=[['today','🌙','اليوم'],['kitchen','🍽️','المطبخ'],['worship','🤲','العبادات'],['khair','❤️','الخير'],['family','👨‍👩‍👧','الأسرة'],['health','🧠','الصحة'],['world','🌍','حول العالم']];
const TASKS=['الفجر','الظهر','العصر','المغرب','العشاء','ورد القرآن','الأذكار','التراويح والقيام','دعاء','صدقة'];
let tab='today';
const card=(t,b,w)=>`<div class="card ${w?'wide':''}"><h3>${t}</h3>${b}</div>`;
const odd=d=>[21,23,25,27,29].includes(d);
const done=()=>S.done[S.day]||[];
const views={
today(d){
 const p=Math.round(done().length/TASKS.length*100);
 return card('🌙 رسالة اليوم '+d,`<p>${d>=21?'<span class="badge">العشر الأواخر</span> ':''}${odd(d)?'<span class="badge">⭐ ليلة وتر: تحرَّ ليلة القدر</span>':'أهلًا بك في يوم جديد من الخير'}</p>`,1)
 +card('🍲 طبق اليوم',`<p>${DISH[d-1]}</p>`)
 +card('📖 ورد اليوم',`<p>الجزء ${d} من القرآن الكريم</p><small>ختمة كاملة في 30 يومًا</small>`)
 +card('🤲 عمل الخير اليوم',`<p>${pick(DEEDS,d)}</p>`)
 +card('👨‍👩‍👧 نشاط الأسرة',`<p>${pick(FAMILY,d)}</p>`)
 +card('🎯 مهمتك اليوم',`<p>${pick(MISSION,d)}</p>`)
 +card('📊 إنجازك',`<div class="ring" style="background:conic-gradient(var(--gold) ${p*3.6}deg,#e8e0cc 0)"><span>${p}%</span></div>`)},
kitchen(d){
 return card('🍲 فطور اليوم',`<p>${DISH[d-1]}</p>`)
 +card('🥣 سحور اليوم',`<p>${pick(SOHOOR,d)}</p>`)
 +card('🍰 حلوى اليوم',`<p>${pick(DESSERT,d)}</p>`)
 +card('🥤 مشروب اليوم',`<p>${pick(DRINK,d)}</p>`)
 +card('🥗 طبق صحي',`<p>سلطة ${['تبولة','فتوش','جرجير وجبن','تونة وخضار'][d%4]} مع زيت الزيتون</p>`)
 +card('💰 طبق اقتصادي',`<p>${pick(BQ,d)}</p>`)
 +card('🧑‍🍳 تحدي الطبخ',`<p>جهّز ${DISH[d-1].split(' ')[0]} بنكهة جديدة وصوّرها لعائلتك!</p>`)
 +card('🛒 قائمة المشتريات',`<ul><li>خضار طازجة</li><li>بروتين: ${d%2?'دجاج':'لحم أو سمك'}</li><li>أرز أو مكرونة</li><li>تمر وفواكه</li><li>مكونات ${pick(DESSERT,d)}</li></ul>`)
 +card('♻️ بقايا الطعام',`<p>${pick(LEFT,d)}</p>`)},
worship(d){
 const dn=done();
 return card('🎯 متابعتي اليومية',TASKS.map((t,i)=>`<div class="chk ${dn.includes(i)?'d':''}" data-t="${i}">${dn.includes(i)?'✅':'⬜'} ${t}</div>`).join('')+'<small>عدّاد شخصي لك وحدك، بلا ترتيب ولا منافسة</small>')
 +card('📿 المسبحة',`<div class="tasbih" id="tsb">${S.tasbih}</div><div style="text-align:center"><button class="btn" id="rst">تصفير</button></div>`)
 +card('📖 القرآن اليومي',`<p>الجزء ${d}</p>`)
 +card('🌙 القيام والعشر',`<p>${d>=21?'أنت في العشر الأواخر: أحيِ الليل':'استعد للعشر الأواخر من الآن'}</p>${odd(d)?'<p>⭐ هذه ليلة وتر، أكثر من: اللهم إنك عفوٌّ تحب العفو فاعفُ عني</p>':''}`)},
khair(d){
 const o=[['🍱','تبرع بوجبة'],['💧','سقيا صائم'],['🧺','سلة غذائية'],['👨‍👩‍👧','كفالة أسرة'],['🤝','تطوع'],['📍','طلب مساعدة']];
 return o.map(([i,t])=>card(i+' '+t,`<button class="btn" data-g="${t}">سجّل نيتي</button>`)).join('')
 +card('📒 سجل خيرك',`<p>${S.gifts.length} نيّة مسجلة</p><small>${S.gifts.slice(-3).map(g=>'يوم '+g.d+': '+g.t).join(' · ')}</small>`,1)
 +card('⚠️ تنبيه',`<small>هذا السجل لمتابعتك الشخصية. نفّذ التبرع الفعلي عبر جهة رسمية موثوقة، مثل بنك الطعام أو الهلال الأحمر.</small>`,1)},
family(d){
 return card('👨‍👩‍👧 سفرة العائلة',`<p>${DISH[d-1]}</p>`)
 +card('🎨 نشاط الأطفال',`<p>${pick(FAMILY,d+3)}</p>`)
 +card('📖 حكاية رمضانية',`<p>احكِ للأطفال قصة عن الصبر أو الكرم في رمضان</p>`)
 +card('🧩 مسابقة',`<p>كم جزءًا في القرآن؟ ${d%2?'30':'114 سورة'}؟ اسألوا بعضكم!</p>`)
 +card('🎁 فكرة هدية',`<p>${['مصحف صغير','فانوس','تمر وشوكولاتة','كتاب أدعية','بطاقة شكر'][d%5]}</p>`)
 +card('🏠 تنظيم البيت',`<p>جهّز مكونات الغد قبل النوم</p>`)},
health(d){
 const w=S.water[d]||0;
 return card('💧 الترطيب',`<div>${Array.from({length:8},(_,i)=>`<span class="glass ${i<w?'d':''}" data-w="${i+1}">🥛</span>`).join('')}</div><small>${w} من 8 أكواب</small>`,1)
 +card('🥗 نصيحة اليوم',`<p>${pick(HEALTH,d)}</p>`)
 +card('😴 النوم',`<p>خصص ساعات متصلة للنوم قدر استطاعتك</p>`)
 +card('⚠️ إرشادات',`<small>معلومات عامة فقط. استشر طبيبك لأي حالة صحية، خاصة المرضى بالسكري والضغط.</small>`)},
world(){return WORLD.map(w=>card(w[0]+' '+w[1],`<ul><li>🍽️ ${w[2]}</li><li>📖 ${w[3]}</li><li>🌙 ${w[4]}</li></ul>`)).join('')}
};
function render(){
 const d=S.day;
 $('#dayTxt').textContent=`🌙 اليوم ${d} من 30`;
 const pc=Math.round(d/30*100);$('#pct').textContent=pc+'%';$('#bar').style.width=pc+'%';
 $('#strip').innerHTML=Array.from({length:30},(_,i)=>`<button class="${i+1==d?'on':''} ${i+1>=21?'last':''}" data-d="${i+1}">${i+1}</button>`).join('');
 $('#tabs').innerHTML=TABS.map(t=>`<button class="${t[0]==tab?'on':''}" data-tab="${t[0]}">${t[1]} ${t[2]}</button>`).join('');
 $('#view').innerHTML=views[tab](d);
 const on=$('#strip .on');if(on)on.scrollIntoView({inline:'center',block:'nearest'});
}
document.addEventListener('click',e=>{
 const q=s=>e.target.closest(s);let x;
 if(x=q('[data-d]'))S.day=+x.dataset.d;
 else if(x=q('[data-tab]'))tab=x.dataset.tab;
 else if(x=q('[data-t]')){const i=+x.dataset.t,a=S.done[S.day]=done().slice();a.includes(i)?a.splice(a.indexOf(i),1):a.push(i)}
 else if(x=q('[data-w]')){const n=+x.dataset.w;S.water[S.day]=(S.water[S.day]||0)==n?n-1:n}
 else if(x=q('[data-g]'))S.gifts.push({d:S.day,t:x.dataset.g});
 else if(q('#tsb'))S.tasbih++;
 else if(q('#rst'))S.tasbih=0;
 else return;
 save();render();
});
render();
