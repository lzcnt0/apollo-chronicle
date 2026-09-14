'use client';

import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ChevronRight,
  ExternalLink,
  MapPinned,
  Orbit,
  Radio,
  ShieldAlert,
  TestTube2,
} from 'lucide-react';
import { flightPhases, landings, readings } from './data';

const nav = [
  { id: 'context', label: 'Замысел' },
  { id: 'flight', label: 'Полёт' },
  { id: 'machines', label: 'Техника' },
  { id: 'atlas', label: 'Лунный атлас' },
  { id: 'science', label: 'Наука' },
  { id: 'risk', label: 'Риски' },
  { id: 'missions', label: 'Хроника и люди' },
];

const hardware = [
  {
    id: 's1',
    code: 'S-IC',
    name: 'Первая ступень',
    metric: '5 × F-1 · ≈34 МН',
    text: 'Керосин и жидкий кислород. Поднимает почти всю стартовую массу через плотную атмосферу и отделяется примерно через 2,5 минуты.',
  },
  {
    id: 's2',
    code: 'S-II',
    name: 'Вторая ступень',
    metric: '5 × J-2 · водород',
    text: 'Продолжает разгон уже в разреженной атмосфере. Жидкий водород эффективен, но требует огромных теплоизолированных баков.',
  },
  {
    id: 's3',
    code: 'S-IVB',
    name: 'Третья ступень',
    metric: '1 × J-2 · 2 включения',
    text: 'Сначала завершает выход на околоземную орбиту, затем повторно включается для транслунной инъекции - перехода на траекторию полёта к Луне.',
  },
  {
    id: 'csm',
    code: 'КСМ',
    name: 'Командно-служебный модуль',
    metric: '3 человека · двигатель SPS',
    text: 'Командный модуль возвращается на Землю. Служебный несёт маршевую двигательную установку, топливные элементы, кислород, воду и радиаторы.',
  },
  {
    id: 'lm',
    code: 'ЛМ',
    name: 'Лунный модуль',
    metric: '2 человека · 2 ступени',
    text: 'Посадочная ступень остаётся на Луне. Взлётная - единственная дорога обратно на окололунную орбиту; аэродинамическая форма и теплозащита модулю, работающему только в вакууме, не нужны.',
  },
];

const missionTimeline = [
  [
    'Apollo 1',
    '1967',
    'Наземное испытание закончилось пожаром и гибелью Гриссома, Уайта и Чаффи. Переработка Block II изменила люк, материалы, проводку и культуру безопасности.',
  ],
  [
    'Apollo 4',
    '1967',
    'Первый полный беспилотный запуск Saturn V; теплозащита командного модуля испытана на скорости возвращения от Луны.',
  ],
  [
    'Apollo 5',
    '1968',
    'Первый полёт лунного модуля: отдельно проверены двигатели посадочной и взлётной ступеней.',
  ],
  [
    'Apollo 6',
    '1968',
    'Отказы двигателей и колебания ракеты, но автоматика компенсировала значительную часть нарушений. Последняя беспилотная квалификация.',
  ],
  [
    'Apollo 7',
    '1968',
    'Первый экипаж Apollo десять суток проверял переработанный командно-служебный модуль на земной орбите.',
  ],
  [
    'Apollo 8',
    '1968',
    'Первый пилотируемый Saturn V, первый полёт людей к Луне и десять витков вокруг неё; снимок Earthrise.',
  ],
  [
    'Apollo 9',
    '1969',
    'Полный комплекс из командно-служебного и лунного модулей испытан у Земли: автономный полёт Spider, стыковка и автономная система жизнеобеспечения скафандра.',
  ],
  [
    'Apollo 10',
    '1969',
    'Генеральная репетиция: лунный модуль Snoopy снизился примерно до 15 км, выполнил встречу и стыковку.',
  ],
  [
    'Apollo 11',
    '1969',
    'Первая посадка. Ручной перелёт опасного участка, 2,5 часа внекорабельной деятельности и 21,6 кг образцов.',
  ],
  [
    'Apollo 12',
    '1969',
    'Два удара молнии при старте и затем точная посадка в 163 м от Surveyor 3.',
  ],
  [
    'Apollo 13',
    '1970',
    'Взрыв кислородного бака отменил посадку. Лунный модуль стал убежищем; экипаж вернулся по свободно-возвратной траектории.',
  ],
  ['Apollo 14', '1971', 'Фра-Мауро и попытка дойти до Cone Crater; геология выбросов Имбриума.'],
  [
    'Apollo 15',
    '1971',
    'Первая экспедиция типа J - длительная научная посадка с усовершенствованным лунным модулем, орбитальным приборным отсеком и ровером. Экипаж прошёл и проехал 27,8 км у борозды Хэдли и Апеннин.',
  ],
  [
    'Apollo 16',
    '1972',
    'Нагорье Декарта: образцы опровергли вулканическую интерпретацию формаций возвышенностей.',
  ],
  [
    'Apollo 17',
    '1972',
    'Первая высадка профессионального геолога, оранжевый вулканический грунт и рекордные 110,5 кг образцов.',
  ],
];

const crisis = [
  {
    time: '55:55',
    title: 'Два кислородных бака теряют давление',
    q: 'Что сохранить для возвращения?',
    answers: [
      'Продолжить питать Odyssey',
      'Отключить командный модуль и перейти в лунный',
      'Немедленно отделить служебный модуль',
    ],
    right: 1,
    why: 'Командный модуль отключили, чтобы сохранить его аккумуляторы и ресурсы для входа. Лунный модуль Aquarius стал спасательной шлюпкой.',
  },
  {
    time: '61:30',
    title: 'Посадка отменена',
    q: 'Как направить комплекс домой?',
    answers: [
      'Обогнуть Луну по свободно-возвратной траектории',
      'Тормозить на окололунную орбиту',
      'Развернуться маршевой установкой служебного модуля',
    ],
    right: 0,
    why: 'Свободно-возвратная траектория уменьшала зависимость от повреждённого служебного модуля. Посадочный двигатель лунного модуля ускорил обратный путь.',
  },
  {
    time: '87:40',
    title: 'CO₂ приближается к опасному уровню',
    q: 'Фильтры двух модулей несовместимы. Что делать?',
    answers: [
      'Отключить вентиляцию',
      'Собрать адаптер из бортовых материалов',
      'Перейти обратно в командный модуль',
    ],
    right: 1,
    why: 'На Земле разработали переходник из картона, пластикового пакета, шланга и ленты; экипаж собрал его по радиоинструкции.',
  },
];

function ReadingBlock({ group }: { group: keyof typeof readings }) {
  const block = readings[group];
  return (
    <div className="reading-block">
      <div className="reading-intro">
        <div>
          <p className="kicker">МАТЕРИАЛ РАЗДЕЛА</p>
          <h3>{block.title}</h3>
        </div>
        <p>{block.deck}</p>
      </div>
      <Accordion type="multiple" defaultValue={[`${group}-0`]} className="reading-list">
        {block.items.map((item, i) => (
          <AccordionItem key={item.title} value={`${group}-${i}`}>
            <AccordionTrigger>
              <span className="reading-num">{String(i + 1).padStart(2, '0')}</span>
              <span>{item.title}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                {item.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {item.takeaways && (
                  <ul>
                    {item.takeaways.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                )}
                <a href={item.source} target="_blank" rel="noreferrer">
                  Источник и дальнейшее чтение <ExternalLink />
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function GlobalMoonMap({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="moon-map">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon_nearside_LRO_5000.jpg"
        alt="Мозаика видимой стороны Луны по данным Lunar Reconnaissance Orbiter"
      />
      <svg viewBox="0 0 1000 1000" role="img" aria-label="Карта мест посадок Apollo">
        {landings.map((s) => {
          const lat = (s.lat * Math.PI) / 180,
            lon = (s.lon * Math.PI) / 180;
          const x = 500 + 465 * Math.sin(lon) * Math.cos(lat),
            y = 500 - 465 * Math.sin(lat);
          return (
            <g
              key={s.id}
              className={selected === s.id ? 'site active' : 'site'}
              onClick={() => onSelect(s.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(s.id);
              }}
              aria-label={`Apollo ${s.id}, ${s.name}`}
            >
              <circle cx={x} cy={y} r="17" />
              <circle cx={x} cy={y} r="6" />
              <text x={x + 24} y={y + 6}>
                A{s.id}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="map-legend">
        <span>90°W</span>
        <b>ВИДИМАЯ СТОРОНА · LRO WAC</b>
        <span>90°E</span>
      </div>
    </div>
  );
}

function Traverse({ id }: { id: string }) {
  const s = landings.find((x) => x.id === id)!;
  const points = s.route.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <div className="traverse">
      <div className="traverse-grid" />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-label={`Схема маршрута Apollo ${id}`}
      >
        <polyline points={points} />
        {s.pois.map((p, i) => (
          <g key={p.name}>
            <circle cx={p.x} cy={p.y} r="1.8" />
            <text x={p.x + 2.5} y={p.y - 2}>
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <span className="north">N ↑</span>
      <small>СХЕМА МАРШРУТОВ · НЕ В МАСШТАБЕ</small>
      <div className="poi-list">
        {s.pois.map((p, i) => (
          <div key={p.name}>
            <b>{i + 1}</b>
            <span>
              <strong>{p.name}</strong>
              <small>{p.note}</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState(0),
    [hardwareId, setHardwareId] = useState('lm'),
    [landingId, setLandingId] = useState('15'),
    [caseNo, setCaseNo] = useState(0),
    [answer, setAnswer] = useState<number | null>(null);
  const landing = useMemo(() => landings.find((x) => x.id === landingId)!, [landingId]);
  const hw = hardware.find((x) => x.id === hardwareId)!;
  return (
    <main id="top">
      <header className="topbar">
        <a className="brand" href="#top">
          <span>
            <Orbit />
          </span>
          <b>АПОЛЛОН</b>
          <small>интерактивный историко-технический атлас</small>
        </a>
      </header>
      <nav className="chapter-nav" aria-label="Главы">
        {nav.map((n, i) => (
          <a key={n.id} href={`#${n.id}`}>
            <b>{i + 1}</b>
            <span>{n.label}</span>
          </a>
        ))}
      </nav>

      <section className="opening">
        <div>
          <p className="kicker">NASA · 1961-1972</p>
          <h1>
            Как на самом деле
            <br />
            работал <em>Apollo</em>
          </h1>
          <p>
            Не каталог имён, а связный маршрут: от выбора архитектуры и орбитальной механики до
            геологии шести районов посадки. Читайте подряд как лекцию или открывайте отдельные
            главы.
          </p>
          <div className="opening-actions">
            <Button asChild>
              <a href="#context">
                Начать маршрут <ArrowRight />
              </a>
            </Button>
            <a href="#atlas">
              Сразу к карте Луны <MapPinned />
            </a>
          </div>
        </div>
        <figure>
          <img
            src="https://www.nasa.gov/wp-content/uploads/2024/06/as08-14-2383orig.jpg?w=1024"
            alt="Восход Земли над лунным горизонтом, Apollo 8"
          />
          <figcaption>
            <b>AS08-14-2383</b> «Восход Земли», 24 декабря 1968 · NASA / William Anders
          </figcaption>
        </figure>
      </section>

      <section className="chapter light" id="context">
        <div className="chapter-side">
          <span>01</span>
          <h2>
            От обещания
            <br />к системе
          </h2>
        </div>
        <ReadingBlock group="context" />
      </section>

      <section className="chapter dark" id="flight">
        <div className="chapter-side">
          <span>02</span>
          <h2>
            Один полёт,
            <br />
            семь переходов
          </h2>
        </div>
        <div className="chapter-main">
          <div className="flight-player">
            <div className="phase-rail">
              {flightPhases.map((p, i) => (
                <button
                  className={phase === i ? 'active' : ''}
                  key={p.n}
                  onClick={() => setPhase(i)}
                >
                  <b>{p.n}</b>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
            <div className="phase-view">
              <div className="orbit-diagram" aria-hidden="true">
                <span className="earth">Земля</span>
                <i />
                <span className="moon">Луна</span>
                <b style={{ left: `${10 + phase * 12.6}%` }}>{flightPhases[phase].n}</b>
              </div>
              <p className="kicker">{flightPhases[phase].time}</p>
              <h3>{flightPhases[phase].name}</h3>
              <p>{flightPhases[phase].detail}</p>
              <strong>{flightPhases[phase].energy}</strong>
            </div>
          </div>
          <ReadingBlock group="flight" />
        </div>
      </section>

      <section className="chapter light" id="machines">
        <div className="chapter-side">
          <span>03</span>
          <h2>
            Машины
            <br />
            Apollo
          </h2>
        </div>
        <div className="chapter-main">
          <div className="hardware-explorer">
            <div className="stack" aria-label="Состав комплекса Apollo">
              {hardware.map((x) => (
                <button
                  key={x.id}
                  className={`${x.id} ${hardwareId === x.id ? 'active' : ''}`}
                  onClick={() => setHardwareId(x.id)}
                >
                  <span>{x.code}</span>
                </button>
              ))}
            </div>
            <div className="hardware-copy">
              <p className="kicker">ВЫБРАННЫЙ ЭЛЕМЕНТ</p>
              <h3>{hw.name}</h3>
              <b>{hw.metric}</b>
              <p>{hw.text}</p>
              <div className="hardware-tabs">
                {hardware.map((x) => (
                  <button
                    key={x.id}
                    onClick={() => setHardwareId(x.id)}
                    className={hardwareId === x.id ? 'active' : ''}
                  >
                    {x.code}
                  </button>
                ))}
              </div>
            </div>
            <figure>
              <img
                src={
                  hardwareId.startsWith('s')
                    ? 'https://images-assets.nasa.gov/image/6761216/6761216~large.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1920&w=1315'
                    : 'https://www.nasa.gov/wp-content/uploads/2024/03/moon-landing-l-4-months-10-apollo-9-spider-free-flight-as09-21-3183.jpg?w=1024'
                }
                alt={
                  hardwareId.startsWith('s')
                    ? 'Старт Saturn V с Apollo 4'
                    : 'Лунный модуль Spider в свободном полёте во время Apollo 9'
                }
              />
              <figcaption>
                {hardwareId.startsWith('s')
                  ? 'Apollo 4 · первый полный старт Saturn V · NASA 6761216'
                  : 'Лунный модуль Spider в свободном полёте · Apollo 9 · NASA AS09-21-3183'}
              </figcaption>
            </figure>
          </div>
          <ReadingBlock group="machines" />
        </div>
      </section>

      <section className="atlas" id="atlas">
        <div className="atlas-head">
          <div>
            <p className="kicker">04 · ИНТЕРАКТИВНАЯ КАРТА</p>
            <h2>
              Шесть посадок.
              <br />
              Шесть разных вопросов.
            </h2>
          </div>
          <p>
            Карта показывает видимую сторону Луны в приблизительной ортографической проекции.
            Нажмите на метку, чтобы открыть связное досье района: критерии выбора, ход полевых работ
            и смысл находок.
          </p>
        </div>
        <div className="atlas-primer">
          <article>
            <b>Почему все районы на видимой стороне?</b>
            <p>
              Прямая радиосвязь с Землёй упрощала управление и передачу телеметрии. Близость ранних
              площадок к экватору уменьшала энергетическую цену смены наклонения орбиты и расширяла
              окна аварийного возвращения.
            </p>
          </article>
          <article>
            <b>Как менялся выбор площадок?</b>
            <p>
              Apollo 11 и 12 прежде всего доказывали безопасность и точность посадки. После этого
              приоритет сместился к геологическому разнообразию: ударным выбросам, древней коре,
              вулканическим равнинам и горным массивам.
            </p>
          </article>
          <article>
            <b>Как читать локальную схему?</b>
            <p>
              Это учебная реконструкция последовательности остановок, а не навигационная трасса.
              Координаты на ней условны; подписи связывают место с задачей и результатом конкретной
              внекорабельной деятельности.
            </p>
          </article>
        </div>
        <div className="atlas-grid">
          <GlobalMoonMap selected={landingId} onSelect={setLandingId} />
          <div className="landing-panel">
            <div className="landing-tabs">
              {landings.map((s) => (
                <button
                  key={s.id}
                  className={landingId === s.id ? 'active' : ''}
                  onClick={() => setLandingId(s.id)}
                >
                  A{s.id}
                </button>
              ))}
            </div>
            <p className="kicker">
              {landing.date} · {landing.lat > 0 ? `${landing.lat}°N` : `${-landing.lat}°S`} ·{' '}
              {landing.lon > 0 ? `${landing.lon}°E` : `${-landing.lon}°W`}
            </p>
            <h3>
              Apollo {landing.id}: {landing.name}
            </h3>
            <div className="landing-stats">
              <span>
                <b>{landing.stay}</b>на поверхности
              </span>
              <span>
                <b>{landing.eva}</b>вне модуля
              </span>
              <span>
                <b>{landing.distance}</b>маршрут
              </span>
              <span>
                <b>{landing.samples}</b>образцы
              </span>
            </div>
            <article>
              <h4>Почему здесь</h4>
              {landing.why.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <h4>Что делали</h4>
              {landing.work.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <h4>Что узнали</h4>
              {landing.finding.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <a href={landing.source} target="_blank" rel="noreferrer">
                Досье LPI <ExternalLink />
              </a>
            </article>
          </div>
        </div>
        <div className="traverse-section">
          <div>
            <p className="kicker">МАРШРУТЫ НА ПОВЕРХНОСТИ</p>
            <h3>Apollo {landing.id}: станции и точки интереса</h3>
            <p>
              Линии показывают последовательность основных участков, а не точную трассу. Для Apollo
              11 это пешая зона вокруг лунного модуля; начиная с Apollo 15 - многокилометровые
              выезды ровера.
            </p>
          </div>
          <Traverse id={landingId} />
        </div>
      </section>

      <section className="chapter light" id="science">
        <div className="chapter-side">
          <span>05</span>
          <h2>
            Луна как
            <br />
            лаборатория
          </h2>
        </div>
        <div className="chapter-main">
          <div className="science-banner">
            <figure>
              <img
                src="https://images-assets.nasa.gov/image/as15-85-11451/as15-85-11451~large.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1920&w=1920"
                alt="Дэвид Скотт рядом с лунным ровером у борозды Хэдли"
              />
              <figcaption>
                Apollo 15 · David Scott и LRV у Hadley Rille · NASA AS15-85-11451
              </figcaption>
            </figure>
            <div>
              <TestTube2 />
              <h3>От «быстро взять камни» к полевой геологии</h3>
              <p>
                Ровер увеличил доступную площадь в сотни раз, телекамера дала геологам на Земле
                возможность следить за работой, а комплект приборов ALSEP продолжал эксперимент
                после отлёта экипажа.
              </p>
            </div>
          </div>
          <ReadingBlock group="science" />
        </div>
      </section>

      <section className="chapter dark" id="risk">
        <div className="chapter-side">
          <span>06</span>
          <h2>
            Когда план
            <br />
            перестаёт работать
          </h2>
        </div>
        <div className="chapter-main">
          <div className="crisis-console">
            <div>
              <p className="kicker">APOLLO 13 · ВРЕМЯ ПОЛЁТА {crisis[caseNo].time}</p>
              <h3>{crisis[caseNo].title}</h3>
              <p>{crisis[caseNo].q}</p>
              <div className="answers">
                {crisis[caseNo].answers.map((x, i) => (
                  <button
                    key={x}
                    disabled={answer !== null}
                    onClick={() => setAnswer(i)}
                    className={
                      answer === i ? (i === crisis[caseNo].right ? 'correct' : 'wrong') : ''
                    }
                  >
                    <b>{String.fromCharCode(65 + i)}</b>
                    {x}
                  </button>
                ))}
              </div>
              {answer !== null && (
                <div className="answer-note">
                  <strong>
                    {answer === crisis[caseNo].right
                      ? 'Решение совпало с Центром управления'
                      : 'Центр управления выбрал другой путь'}
                  </strong>
                  <p>{crisis[caseNo].why}</p>
                  <Button
                    onClick={() => {
                      setCaseNo((caseNo + 1) % crisis.length);
                      setAnswer(null);
                    }}
                  >
                    Следующая ситуация <ChevronRight />
                  </Button>
                </div>
              )}
            </div>
            <aside>
              <Radio />
              <span>РУКОВОДИТЕЛЬ ПОЛЁТА / СВЯЗЬ С ЭКИПАЖЕМ</span>
              <div className="wave">
                {[22, 51, 18, 38, 62, 31, 44, 20, 55, 27, 48, 16].map((h, i) => (
                  <i key={i} style={{ height: h }} />
                ))}
              </div>
              <small>
                Сценарий упрощён: после выбора показано реальное решение и его инженерная причина.
              </small>
            </aside>
          </div>
          <ReadingBlock group="risk" />
        </div>
      </section>

      <section className="missions" id="missions">
        <div className="missions-head">
          <div>
            <p className="kicker">07 · ХРОНИКА</p>
            <h2>
              Каждый полёт снимал
              <br />
              следующую неопределённость
            </h2>
          </div>
          <p>
            Нумерация 2 и 3 официально не использовалась. Цепочка ниже связывает испытания,
            экспедиции и уроки, а не просто перечисляет экипажи.
          </p>
        </div>
        <div className="mission-list">
          {missionTimeline.map((m, i) => (
            <article key={m[0]}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <small>{m[1]}</small>
              <h3>{m[0]}</h3>
              <p>{m[2]}</p>
            </article>
          ))}
        </div>
        <ReadingBlock group="operations" />
      </section>

      <footer>
        <div>
          <h2>Источники</h2>
        </div>
        <div className="sources">
          <a href="https://www.nasa.gov/the-apollo-program/" target="_blank">
            NASA · Apollo Program <ExternalLink />
          </a>
          <a href="https://www.nasa.gov/history/alsj-and-afj/" target="_blank">
            Apollo Journals <ExternalLink />
          </a>
          <a href="https://www.lpi.usra.edu/lunar/missions/" target="_blank">
            LPI · Mission Overviews <ExternalLink />
          </a>
          <a href="https://history.nasa.gov/SP-4029/Apollo_00_Welcome.htm" target="_blank">
            Apollo by the Numbers <ExternalLink />
          </a>
          <a href="https://curator.jsc.nasa.gov/lunar/" target="_blank">
            Lunar Sample Laboratory <ExternalLink />
          </a>
          <a href="https://www.nasa.gov/nasa-brand-center/images-and-media/" target="_blank">
            NASA Images and Media <ExternalLink />
          </a>
        </div>
        <div className="credits">
          <span>Изображения: NASA / LRO / JSC</span>
          <a href="#top">Наверх ↑</a>
        </div>
      </footer>
    </main>
  );
}
