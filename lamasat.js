/* lamasat.js */
/* ========= بيانات الشبكة ========= */
window.LAMASAT = {
  networkName: 'الهاشم',
  phone: '773130008',

  // الشريط النصّي المتحرك
  marquee: {
    text: 'شبكة الهاشم ⚡ إنترنت سريع ومستقر • كروت متنوعة تناسب الجميع • نقاط البيع متوفرة في البقالات المجاورة',
    duration: 16
  },

  // نقاط البيع
  pos: [
    { name: 'جميع البقالات المجاورة للشبكة', area: '', phone: '' }
  ],

  // رابط الاستراحة
  restUrl: 'http://30.10.10.10:88/',

  // رابط البث المباشر
  live: {
    url: '',
    title: 'البث المباشر',
    subtitle: 'HD • سريع'
  },

  // الأسعار
  pricing: [
    { plan: '100 ريال',  hours: '4 ساعات',  mb: 'محدود', validity: '7 أيام' },
    { plan: '200 ريال',  hours: '5 ساعات',  mb: 'مفتوح', validity: '10 أيام' },
    { plan: '250 ريال',  hours: '13 ساعة', mb: 'محدود', validity: '13 يوم' },
    { plan: '500 ريال',  hours: '30 ساعة', mb: 'محدود', validity: '20 يوم' },
    { plan: '1000 ريال', hours: '60 ساعة', mb: 'محدود', validity: '30 يوم' }
  ],

  // الخدمات
  services: [
    {
      title: 'باقات الإنترنت',
      desc: 'باقات متنوعة تناسب جميع الاستخدامات.',
      tags: ['سريعة', 'مستقرة', { label: 'متنوعة', accent: true }]
    },
    {
      title: 'نقاط البيع',
      desc: 'الكروت متوفرة في جميع البقالات المجاورة للشبكة.',
      tags: ['متوفرة', 'قريبة']
    },
    {
      title: 'دعم فني',
      desc: 'لأي استفسار أو مساعدة تواصل معنا.',
      tags: ['اتصال', 'واتساب']
    }
  ],

  // التعليمات
  instructions: {
    steps: [
      { text: 'افتح الواي فاي واختر شبكة {{name}}.' },
      { text: 'أدخل رقم الكرت في خانة اسم المستخدم.' },
      { text: 'اضغط تسجيل الدخول واستمتع بالتصفح.' }
    ],
    faq: [
      {
        q: 'من أين أشتري الكروت؟',
        a: 'من جميع البقالات المجاورة للشبكة.'
      },
      {
        q: 'كيف أتواصل مع الإدارة؟',
        a: 'على الرقم 773130008.'
      }
    ]
  }
};

(function () {
  var cfg = window.LAMASAT || {};

  /* ============== Helpers ============== */
  function normalizePhone(p){
    if(!p) return '';
    p = String(p).trim();
    var hasPlus = p.startsWith('+');
    p = p.replace(/[^\d]/g,'');
    return hasPlus ? ('+'+p) : p;
  }
  function waFromTel(tel){
    return String(tel || '').replace(/^\+/, '');
  }
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }

  function safeText(v){ return (v==null ? '' : String(v)); }

  function ready(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* ============== 1) اسم الشبكة ============== */
 /* ============== 1) اسم الشبكة (ثابت بدون تبديل) ============== */
function initNetLabel(){
  var name = (cfg.networkName || '').toString().trim();
  var el = document.getElementById('netLabel');
  if (!el || !name) return;

  // ثابت
  el.classList.remove('hidden');
  el.textContent = name;

  // عنوان الصفحة (اختياري)
  try {
    // لو صفحة الحالة
    if ((document.title || '').includes('حالة الكرت')) {
      document.title = 'حالة الكرت | ' + name;
    } else {
      document.title = 'شبكة ' + name;
    }
  } catch(_){}
}


  /* ============== 2) رقم الدعم (الفوتر) ============== */
  function setSupportPhone(){
    var phoneRaw = cfg.phone;

    var supportLine = document.getElementById('supportLine');
    var phoneTextEl = document.getElementById('clientPhoneText');
    var telLink     = document.getElementById('telLink');
    var waLink      = document.getElementById('waLink');

    if (!phoneRaw) {
      if (supportLine) supportLine.style.display = 'none';
      return;
    }

    var tel = normalizePhone(phoneRaw);
    var wa  = waFromTel(tel);

    if (supportLine) supportLine.style.display = '';
    if (phoneTextEl) phoneTextEl.textContent = tel;
    if (telLink)     telLink.href = 'tel:' + tel;
    if (waLink)      waLink.href  = 'https://wa.me/' + wa;

    // تحديث أي روابط tel/sms في صفحاتك (الـ quick links)
    qsa('a[href^="tel:"], a[data-tel-auto="1"]').forEach(function(a){
      try{ a.href = 'tel:' + tel; }catch(_){}
    });
    qsa('a[href^="sms:"], a[data-sms-auto="1"]').forEach(function(a){
      try{ a.href = 'sms:' + tel; }catch(_){}
    });
  }

  /* ============== 3) الماركيه ============== */
  function initMarquee(){
    var m = cfg.marquee || {};
    var text = (typeof m.text === 'string') ? m.text.trim() : '';
    var dur  = Number(m.duration) > 0 ? Number(m.duration) : null;

    var box   = document.getElementById('marqueeBox');
    var track = document.getElementById('marqueeTrack');
    var span  = document.getElementById('marqueeText');

    if (!text) { if (box) box.style.display = 'none'; return; }

    if (span) span.textContent = text;
    if (box)  box.style.display = '';

    if (track && dur) {
      track.style.setProperty('--dur', dur + 's');
      track.style.animationDuration = dur + 's';
    }
  }

  /* ============== 4) نقاط البيع ============== */
  // يدعم:
  // - جدول قديم: #posTable tbody
  // - صفحة جديدة: #list + بحث #q/#clearBtn
  function buildPOS(){
    var list = Array.isArray(cfg.pos) ? cfg.pos : [];

    // (A) الجدول القديم
    var tbody = qs('#posTable tbody');
    if (tbody){
      while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
      list.forEach(function(item){
        var name = safeText(item && item.name);
        var area = safeText(item && item.area);
        var raw  = safeText(item && item.phone);
        var tel  = normalizePhone(raw);
        var wa   = waFromTel(tel);

        var tr = document.createElement('tr');

        var tdName = document.createElement('td'); tdName.textContent = name;
        var tdArea = document.createElement('td'); tdArea.textContent = area;

        var tdTel = document.createElement('td'); tdTel.className = 'fit';
        var aTel = document.createElement('a');
        aTel.className = 'btn btn-primary';
        aTel.textContent = '📞';
        aTel.href = tel ? ('tel:' + tel) : '#';
        tdTel.appendChild(aTel);

        var tdWa = document.createElement('td'); tdWa.className = 'fit';
        var aWa = document.createElement('a');
        aWa.className = 'btn btn-light';
        aWa.textContent = '💬';
        aWa.href = wa ? ('https://wa.me/' + wa) : '#';
        aWa.target = '_blank';
        tdWa.appendChild(aWa);

        tr.appendChild(tdName);
        tr.appendChild(tdArea);
        tr.appendChild(tdTel);
        tr.appendChild(tdWa);
        tbody.appendChild(tr);
      });
    }

    // (B) صفحة POS الجديدة (قائمة فقط)
    var listBox = document.getElementById('list');
    var qInp    = document.getElementById('q');
    var clearBtn= document.getElementById('clearBtn');

    if (!listBox) return;

    // حول cfg.pos إلى شكل بسيط {name}
    var POS = list
      .map(function(x){ return { name: safeText(x && x.name).trim() }; })
      .filter(function(x){ return x.name.length > 0; });

    function createItem(name){
      var el = document.createElement('div');
      el.className = 'item';
      el.innerHTML = '<span class="bullet" aria-hidden="true"></span><div class="i-name"></div>';
      el.querySelector('.i-name').textContent = name;
      return el;
    }

    function render(items){
      listBox.innerHTML = '';
      if(!items.length){
        listBox.appendChild(createItem('لا توجد نقاط بيع مطابقة للبحث'));
        return;
      }
      items.forEach(function(p){ listBox.appendChild(createItem(p.name)); });
    }

    function normalize(s){
      return (s||'').toString().trim()
        .replace(/\s+/g,' ')
        .replace(/[ًٌٍَُِْٕٓٔـ]/g,''); // إزالة الحركات
    }

    function filter(){
      var term = normalize(qInp ? qInp.value : '').toLowerCase();
      if(!term){ render(POS); return; }
      var out = POS.filter(function(p){ return normalize(p.name).toLowerCase().includes(term); });
      render(out);
    }

    // اربط أحداث البحث لو العناصر موجودة
    if (qInp) qInp.addEventListener('input', filter);
    if (clearBtn) clearBtn.addEventListener('click', function(){
      if(qInp){ qInp.value=''; filter(); qInp.focus(); }
    });

    render(POS);
  }

  /* ============== 5) الأسعار ============== */
  // يدعم:
  // - صفحة جديدة: tbody#price-tbody
  // - صفحة قديمة: #pricingBody أو #pricingTable tbody
  function buildPricing(){
    var rows = Array.isArray(cfg.pricing) ? cfg.pricing : [];

    // (A) الجديد
    var tbodyNew = document.getElementById('price-tbody');
    if (tbodyNew){
      tbodyNew.innerHTML = '';
      rows.forEach(function(item){
        var tr = document.createElement('tr');

        function chipHTML(type, content, icon){
          return '<span class="chip '+type+'"><span class="ico">'+icon+'</span>'+content+'</span>';
        }
        function fmtTime(v){ return safeText(v); }
        function fmtDays(v){ return safeText(v); }

        tr.innerHTML =
          '<td class="p-name">'+ safeText(item.plan) +'</td>' +
          '<td>'+ chipHTML('size', safeText(item.mb), '🗂️') +'</td>' +
          '<td>'+ chipHTML('time', fmtTime(item.hours), '⏱️') +'</td>' +
          '<td>'+ chipHTML('days', fmtDays(item.validity), '📅') +'</td>';

        tbodyNew.appendChild(tr);
      });
      return; // لو صفحة جديدة موجودة خلاص
    }

    // (B) القديم
    var tbody = document.getElementById('pricingBody');
    if (!tbody) {
      var pricingTable = document.getElementById('pricingTable');
      if (pricingTable) tbody = pricingTable.querySelector('tbody');
    }
    if (!tbody) return;

    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

    rows.forEach(function(item){
      var tr = document.createElement('tr');

      function td(txt){
        var el = document.createElement('td');
        el.textContent = safeText(txt);
        return el;
      }

      tr.appendChild(td(item.plan));
      tr.appendChild(td(item.hours));
      tr.appendChild(td(item.mb));
      tr.appendChild(td(item.validity));
      tbody.appendChild(tr);
    });
  }

  /* ============== 6) الخدمات (اختياري) ============== */
  // لو عندك صفحة خدمات ديناميكية: ضع container id="servicesGrid"
  function buildServices(){
    var list = Array.isArray(cfg.services) ? cfg.services : [];
    var grid = document.getElementById('servicesGrid');
    if (!grid) return;

    while (grid.firstChild) grid.removeChild(grid.firstChild);

    list.forEach(function(svc){
      var card = document.createElement('div');
      card.className = 'service-card';

      var h4 = document.createElement('h4');
      h4.textContent = svc.title || '';

      var p = document.createElement('p');
      p.textContent = svc.desc || '';

      var tagsWrap = document.createElement('div');
      tagsWrap.className = 'service-tags';

      (Array.isArray(svc.tags) ? svc.tags : []).forEach(function(t){
        var badge = document.createElement('span');
        if (typeof t === 'string') {
          badge.className = 'badge';
          badge.textContent = t;
        } else if (t && typeof t === 'object') {
          badge.className = 'badge' + (t.accent ? ' badge-accent' : '');
          badge.textContent = t.label || '';
        }
        tagsWrap.appendChild(badge);
      });

      card.appendChild(h4);
      card.appendChild(p);
      card.appendChild(tagsWrap);
      grid.appendChild(card);
    });
  }

  /* ============== 7) التعليمات ============== */
  function buildInstructions(){
    var data = cfg.instructions || {};
    var name = cfg.networkName || '';

    function fill(str){
      return safeText(str).replace(/{{\s*name\s*}}/g, name);
    }

    // steps
    var stepsWrap = document.getElementById('stepsList');
    if (stepsWrap && Array.isArray(data.steps)) {
      while (stepsWrap.firstChild) stepsWrap.removeChild(stepsWrap.firstChild);
      data.steps.forEach(function(step, i){
        var stepDiv = document.createElement('div');
        stepDiv.className = 'step';

        var num = document.createElement('div');
        num.className = 'step-num';
        num.textContent = (i + 1);

        var txt = document.createElement('div');
        if (step && step.html) txt.innerHTML = fill(step.html);
        else txt.textContent = fill(step && step.text);

        stepDiv.appendChild(num);
        stepDiv.appendChild(txt);
        stepsWrap.appendChild(stepDiv);
      });
    }

    // faq
    var faqWrap = document.getElementById('faqList');
    if (faqWrap && Array.isArray(data.faq)) {
      while (faqWrap.firstChild) faqWrap.removeChild(faqWrap.firstChild);

      data.faq.forEach(function(item){
        var it  = document.createElement('div');
        it.className = 'accordion-item';

        var btn = document.createElement('button');
        btn.className = 'accordion-header';
        btn.textContent = item ? item.q : '';

        var content = document.createElement('div');
        content.className = 'accordion-content';
        if (item && item.html) content.innerHTML = fill(item.html);
        else content.textContent = fill(item ? item.a : '');

        btn.addEventListener('click', function(){
          it.classList.toggle('active');
        });

        it.appendChild(btn);
        it.appendChild(content);
        faqWrap.appendChild(it);
      });
    }
  }

  /* ============== 8) ربط الاستراحة + البث المباشر في status ============== */
  // يدعم:
  // - عناصر عليها data-live="1" أو data-rest="1"
  // - أو يلتقط أول زر .cta-btn.is-live / .cta-btn.is-break إن وجد
  function applyLiveAndRest(){
    var restUrl = safeText(cfg.restUrl).trim();
    var live = cfg.live || {};
    var liveUrl = safeText(live.url).trim();

    // REST
    if (restUrl){
      var restA = qs('a[data-rest="1"]') || qs('a.cta-btn.is-break');
      if (restA){
        restA.href = restUrl;
        // لو حاب تعرضه في small
        var small = restA.querySelector('small');
        if (small) small.textContent = restUrl.replace(/^https?:\/\//,'');
      }
      // لو فيه مودال نسخ داخل services (copyRestLink) استخدم restUrl بدل ثابت
      var copyBtn = document.getElementById('copyRestLink');
      if(copyBtn){
        // نخلي الـ onclick الموجود ينسخ REST_URL داخل الصفحة؟ ما نكسر شيء.
        // فقط نوفر متغير عالمي اختياري
        window.REST_URL = restUrl;
      }
    }

    // LIVE
    if (liveUrl){
      var liveA = qs('a[data-live="1"]') || qs('a.cta-btn.is-live');
      if (liveA){
        liveA.href = liveUrl;
        // title/subtitle لو موجودة
        var b = liveA.querySelector('b');
        var sm = liveA.querySelector('small');
        if (b && live.title) b.textContent = safeText(live.title);
        if (sm && live.subtitle) sm.textContent = safeText(live.subtitle);
      }
    }
  }

  /* ============== RUN ============== */
  ready(function(){
    // عام
    initNetLabel();
    setSupportPhone();
    initMarquee();

    // صفحات
    buildPOS();
    buildPricing();
    buildServices();
    buildInstructions();

    // status / live-rest binding
    applyLiveAndRest();
  });

})();
