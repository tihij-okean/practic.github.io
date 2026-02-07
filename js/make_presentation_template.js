const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';

const titleStyle = { fontFace: 'Calibri', fontSize: 34, bold: true, color: 'FFFFFF' };
const hStyle = { fontFace: 'Calibri', fontSize: 22, bold: true, color: 'FFFFFF' };
const bStyle = { fontFace: 'Calibri', fontSize: 16, color: 'E2E8F0' };

function addBg(slide){
  slide.background = { color: '0B1020' };
  slide.addShape(pptx.ShapeType.rect, { x:0, y:0, w:13.33, h:0.25, fill:{color:'4F46E5'} });
  slide.addShape(pptx.ShapeType.rect, { x:0, y:7.25, w:13.33, h:0.25, fill:{color:'EC4899'} });
}

function addTitle(slide, t, s){
  slide.addText(t, { x:0.7, y:0.6, w:12, h:0.8, ...titleStyle });
  if(s) slide.addText(s, { x:0.7, y:1.5, w:12, h:0.5, ...bStyle });
}

const slides = [
  {title:'Название проекта', subtitle:'Направление ФСИ • Автор • Группа', bullets:[
    'Короткий слоган (1 строка): что делаем и для кого.'
  ]},
  {title:'Проблема', bullets:[
    'Формулировка по шаблону «в … при … возникает …, поскольку …»',
    '1–2 факта/цифры + источник',
    'Кто страдает и какие последствия'
  ]},
  {title:'Цель и задачи', bullets:[
    'Цель: измеримый результат',
    '3–5 задач: каждая = конкретный результат/артефакт'
  ]},
  {title:'Целевая аудитория', bullets:[
    'Сегмент ЦА: роль, контекст, KPI',
    'Персона: боли, ограничения, инструменты «как сейчас»'
  ]},
  {title:'Сценарий использования', bullets:[
    'Use Case: 5–8 шагов',
    'Входы/выходы данных',
    'Метрики сценария (время/точность/ошибки)'
  ]},
  {title:'Аналоги и сравнение', bullets:[
    'Таблица: 3 аналога + ваш проект',
    'Критерии: ≥3 количественных + ≥2 качественных',
    'Вывод: ограничения аналогов и ниша проекта'
  ]},
  {title:'План реализации', bullets:[
    'Диаграмма Ганта (по неделям)',
    '5–7 вех (milestones)'
  ]},
  {title:'Ресурсы и риски', bullets:[
    'Ключевые ресурсы: данные/ПО/оборудование',
    'Top‑3 риска (P×I) + меры снижения'
  ]},
  {title:'Экономика', bullets:[
    'Топ‑затраты: разовые и регулярные',
    '1 модель дохода/эффекта',
    'Простой расчёт эффекта (1 сценарий)'
  ]},
  {title:'Итоги и следующие шаги', bullets:[
    'Что уже готово по итогам практики',
    'Следующие 2 шага на 2 недели',
    'Источники (список ссылок)'
  ]},
];

slides.forEach((s, idx)=>{
  const slide = pptx.addSlide();
  addBg(slide);
  addTitle(slide, `${idx+1}. ${s.title}`, s.subtitle);
  const y0 = s.subtitle ? 2.2 : 1.8;
  let y = y0;
  (s.bullets||[]).forEach(b=>{
    slide.addText('• ' + b, { x:0.9, y, w:12, h:0.4, ...bStyle });
    y += 0.45;
  });
});

pptx.writeFile({ fileName: '/mnt/data/practice_site/downloads/template_presentation.pptx' });
