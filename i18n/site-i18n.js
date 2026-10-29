(()=>{'use strict';
const langs={ar:'العربية',en:'English',fr:'Français',es:'Español',tr:'Türkçe',id:'Indonesia',ur:'اردو',bn:'বাংলা',fa:'فارسی',ru:'Русский',de:'Deutsch'};
const rtl=new Set(['ar','ur','fa']);
const root='/i18n/';
const surahNames=["Al-Fatihah", "Al-Baqarah", "Ali Imran", "An-Nisa", "Al-Maidah", "Al-Anam", "Al-Araf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Rad", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Muminun", "An-Nur", "Al-Furqan", "Ash-Shuara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqiah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumuah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Maarij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Naziat", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-Ala", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qariah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Maun", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"];
const reciterNames={"وليد النائحي":"Waleed Al-Naihi","خالد القحطاني":"Khalid Al-Qahtani","إدريس أبكر":"Idris Abkar","محمد جبريل":"Muhammad Jibreel","أحمد العجمي":"Ahmed Al-Ajmi","أبو بكر الشاطري":"Abu Bakr Al-Shatri","ياسر سلامة":"Yasser Salama","محمد الطبلاوي":"Muhammad Al-Tablawi","صلاح البدير":"Salah Al-Budair","عبدالودود حنيف":"Abdul Wadud Haneef","عبدالمحسن القاسم":"Abdulmohsen Al-Qasim","محمد اللحيدان":"Muhammad Al-Luhaidan","ناصر القطامي":"Nasser Al-Qatami","فارس عباد":"Fares Abbad","محمد أيوب":"Muhammad Ayyub","إبراهيم الأخضر":"Ibrahim Al-Akhdar","عبد الله الجهني":"Abdullah Al-Juhany","عبدالله الجهني":"Abdullah Al-Juhany","أحمد خليل شاهين":"Ahmed Khalil Shaheen","إسلام صبحي":"Islam Sobhi","ماجد الزامل":"Majed Al-Zaml","عبدالعزيز الزهراني":"Abdulaziz Al-Zahrani","منصور السالمي":"Mansour Al-Salmi","عبد الله خياط":"Abdullah Khayyat","عبدالله خياط":"Abdullah Khayyat","عبدالرحمن السديس": "Abdul Rahman Al-Sudais", "سعود الشريم": "Saud Al-Shuraim", "محمد صديق المنشاوي": "Muhammad Siddiq Al-Minshawi", "هيثم الدخين": "Haitham Al-Dukhain", "أحمد بن علي العجمي": "Ahmed Al-Ajmi", "عبدالباسط عبدالصمد": "Abdul Basit Abdus Samad", "سعد الغامدي": "Saad Al-Ghamdi", "ياسر الدوسري": "Yasser Al-Dosari", "مشاري العفاسي": "Mishary Alafasy", "علي جابر": "Ali Jaber", "ماهر المعيقلي": "Maher Al-Muaiqly", "محمود خليل الحصري": "Mahmoud Khalil Al-Hussary", "خالد الجليل": "Khalid Al-Jalil", "نبيل الرفاعي": "Nabil Al-Rifai"};
const original=new WeakMap();let seq=0;
const picker=document.createElement('select');picker.id='surquran-language';picker.setAttribute('aria-label','Language / اللغة');
for(const [code,name] of Object.entries(langs)){const option=document.createElement('option');option.value=code;option.textContent=name;picker.appendChild(option)}
const wrap=document.createElement('li');wrap.className='surquran-language-wrap';wrap.appendChild(picker);
const style=document.createElement('style');
style.textContent=`
.main-nav .surquran-language-wrap{display:flex;align-items:center;justify-content:center;margin:0;padding:0;list-style:none;min-width:0}
.main-nav .surquran-language-wrap select{box-sizing:border-box;display:block;width:auto;max-width:100%;min-width:115px;padding:7px 25px 7px 9px;border:1px solid #aebdd2;border-radius:6px;background:#fff;color:#003366!important;font:inherit;font-size:inherit;line-height:1.5;cursor:pointer;direction:auto}
.main-nav .surquran-language-wrap select option{color:#003366;background:#fff}
.main-nav .surquran-language-wrap select:focus-visible{outline:2px solid #0066cc;outline-offset:2px}
@media(max-width:768px){.main-nav .surquran-language-wrap{width:100%;padding:6px 12px;justify-content:stretch}.main-nav .surquran-language-wrap select{width:100%;min-width:0;max-width:none}}
.surquran-i18n-text{unicode-bidi:plaintext}
`;
document.head.appendChild(style);
// Put language choice inside the existing navigation list, so the hamburger
// controls it together with the other links on mobile.
const navList=document.querySelector('.main-header .main-nav > ul')||document.querySelector('.main-nav > ul');
if(navList){navList.appendChild(wrap)}else{
 // Graceful fallback for pages without the shared navigation markup.
 const fallback=document.querySelector('.main-header .container')||document.querySelector('.main-header')||document.body;
 const holder=document.createElement('ul');holder.className='surquran-language-fallback';holder.appendChild(wrap);fallback.appendChild(holder);
}

const forbidden='script,style,noscript,textarea,code,pre,.quran-text,.ayah,.bismillah,.ayah-number,.lafz-jalalah,.ayah-meaning,[data-no-translate],[translate="no"]';
function isSafe(node){const el=node.parentElement;return el&&!el.closest(forbidden)&&!el.closest('#surquran-language')}
function remember(node){if(!original.has(node))original.set(node,node.nodeValue);return original.get(node)}
 function reciterName(ar){return reciterNames[ar.trim()]||ar.trim()}
 function renderTemplate(template, surah, reciter){return template.replace(/\{surah\}/g,surah).replace(/\{reciter\}/g,reciter)}
 function translateValue(value,labels,dict){
  const lead=value.match(/^\s*/)[0],tail=value.match(/\s*$/)[0],s=value.trim();if(!s)return value;
  const templates=dict.mp3||{};
  let translated=labels[s];
  if(!translated){const arrow=s.match(/^(.*?)\s*(▾|▼)$/);if(arrow&&labels[arrow[1].trim()])translated=labels[arrow[1].trim()]+' '+arrow[2]}
  if(!translated){const m=s.match(/^سورة\s+(.+?)\s+بصوت الشيخ\s+(.+)$/);if(m){translated=renderTemplate(templates.byReciter||'Surah {surah} — Recited by {reciter}',translateSurah(m[1],dict),reciterName(m[2]))}}
  if(!translated){const m=s.match(/^الاستماع لسورة\s+(.+?)\s+بصوت الشيخ\s+(.+?)\s+مع إمكانية التحميل المباشر للسورة بصيغة\s+MP3$/s);if(m){translated=renderTemplate(templates.description||'Listen to Surah {surah} recited by {reciter}, with direct MP3 download',translateSurah(m[1],dict),reciterName(m[2]))}}
  if(!translated){const m=s.match(/^سور أخرى بصوت الشيخ\s+(.+)$/);if(m)translated=renderTemplate(templates.otherByReciter||'Other surahs recited by {reciter}','',reciterName(m[1]))}
  if(!translated){const m=s.match(/^سورة\s+(.+?)\s+بصوت قراء آخرين$/);if(m)translated=renderTemplate(templates.otherReciters||'Surah {surah} by other reciters',translateSurah(m[1],dict),'')}
  if(!translated){const m=s.match(/^تحميل سورة\s+(.+?)\s+MP3$/);if(m)translated=renderTemplate(templates.download||'Download Surah {surah} MP3',translateSurah(m[1],dict),'')}
  if(!translated){const m=s.match(/^سورة\s+(.+?)\s*(←|→)$/);if(m)translated=(templates.surah||'Surah')+' '+translateSurah(m[1],dict)+' '+m[2]}
  if(!translated&&s==='لا توجد سورة سابقة')translated=templates.noPrevious||'No previous surah';
  if(!translated){const m=s.match(/^قراءة\s+سورة\s+(.+)$/);if(m)translated=(dict.written?.readSurah||'Read Surah {surah}').replace('{surah}',translateSurah(m[1],dict))}
  if(!translated){const m=s.match(/^الاستماع\s+لسورة\s+(.+?)\s+بصوت\s+أشهر\s+القراء$/);if(m)translated=(dict.written?.listenPopular||'Listen to Surah {surah} by popular reciters').replace('{surah}',translateSurah(m[1],dict))}
  if(!translated){const m=s.match(/^(رقم السورة|عدد آياتها|عدد كلماتها|اسمها بالإنجليزية)\s*:\s*(.*)$/);if(m){const k={'رقم السورة':'surahNumber','عدد آياتها':'verseCount','عدد كلماتها':'wordCount','اسمها بالإنجليزية':'englishName'}[m[1]];translated=(dict.written?.[k]||m[1])+': '+m[2]}}
  if(!translated){const m=s.match(/^سورة\s+(.+?)\s+(مكية|مدنية)$/);if(m)translated=(dict.mp3?.surah||'Surah')+' '+translateSurah(m[1],dict)+' — '+(dict.written?.[m[2]==='مكية'?'meccan':'medinan']||m[2])}
  if(!translated){const m=s.match(/^سورة\s+(.+)$/);if(m)translated=(templates.surah||dict.surahPrefix||'Surah')+' '+translateSurah(m[1],dict)}
  if(!translated&&reciterNames[s])translated=reciterName(s);
  if(!translated){const normalized=s.replace(/\s+/g,' ').trim();if(labels[normalized])translated=labels[normalized]}
  if(!translated&&labels['أو']){const parts=s.split(/(أو الاستماع اليه بأصوات أشهر القراء\.|كما يمكنك|يمكنك الآن|بكل سهولة\.|أو)/g);if(parts.length>1){const candidate=parts.map(part=>labels[part]||part).join('');if(candidate!==s)translated=candidate}}
  if(!translated&&s.includes('رقم السورة:')&&s.includes('عدد آياتها:')){
    translated=s.replace(/رقم السورة\s*:/g,(dict.written?.surahNumber||'Surah number')+':').replace(/عدد آياتها\s*:/g,(dict.written?.verseCount||'Number of verses')+':').replace(/عدد كلماتها\s*:/g,(dict.written?.wordCount||'Number of words')+':').replace(/اسمها بالإنجليزية\s*:/g,(dict.written?.englishName||'English name')+':');
  }
  return translated?lead+translated+tail:value
 }
function translateSurah(name,dict){const idx=arabicSurahs.indexOf(name.replace(/^سورة\s+/,'').trim());return idx>=0?surahNames[idx]:name}
const arabicSurahs=["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];
function translateIndex(dict){document.querySelectorAll('.quran-index .quran-table tbody tr').forEach(row=>{const cells=row.querySelectorAll('td');if(cells.length<5)return;const a=cells[1].querySelector('a[href]');if(!a)return;const m=a.getAttribute('href').match(/(?:^|\/)surah\/(\d+)\.html(?:[?#]|$)/);if(!m)return;const i=Number(m[1])-1;if(i<0||i>=surahNames.length)return;
 if(!original.has(a))original.set(a,a.textContent);a.textContent=picker.value==='ar'?original.get(a):surahNames[i]})}
async function setLang(lang){if(!langs[lang])lang='ar';const my=++seq;picker.value=lang;try{localStorage.setItem('surquran-lang',lang)}catch(e){}
 let dict={labels:{}};try{const response=await fetch(root+'ui/'+lang+'.json');if(!response.ok)throw Error('missing dictionary');dict=await response.json()}catch(e){console.warn('UI dictionary unavailable',e)}
 if(my!==seq)return;
 // Keep the site's original column order and sidebar placement for all languages.
 document.documentElement.lang=lang;document.documentElement.dir='rtl';
 const labels=dict.labels||{};
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode()){if(isSafe(walker.currentNode))nodes.push(walker.currentNode)}
 for(const node of nodes){const ar=remember(node);node.nodeValue=lang==='ar'?ar:translateValue(ar,labels,dict)}
 for(const el of document.querySelectorAll('input[placeholder],textarea[placeholder],img[alt]')){const attr=el.hasAttribute('placeholder')?'placeholder':'alt';const key=attr+':original';if(!el.dataset.i18nOriginal){el.dataset.i18nOriginal=el.getAttribute(attr)}const ar=el.dataset.i18nOriginal;el.setAttribute(attr,lang==='ar'?ar:translateValue(ar,labels,dict).trim())}
 translateIndex(dict);
 // No machine-generated verse meanings. Original Arabic Quran text remains untouched.
}
picker.addEventListener('change',()=>setLang(picker.value));let saved='ar';try{saved=localStorage.getItem('surquran-lang')||'ar'}catch(e){}setLang(saved);
})();