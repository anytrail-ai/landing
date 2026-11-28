import { useEffect, useRef } from 'react'
import { Check, Sparkles } from 'lucide-react'

// The four module scenes. Each is one small product screen drawn as a pure
// function of `beat` (see sceneBeats.js): nothing here keeps its own
// progress, so the same beat always draws the same screen. Movement comes
// from CSS transitions on `is-on` and from elements mounting.
//
// Shared vocabulary:
//   on(n)      true from beat n onwards
//   <Fill>     a value that is a grey placeholder until its beat, then data
//   <Tag>      a status chip in the app's tones (plain | bad | warn | good)
//   <Press>    a button that shows at one beat and is "pressed" at the next,
//              becoming a confirmation stamp

const cls = (...parts) => parts.filter(Boolean).join(' ')

function Tag({ tone = 'plain', children }) {
  // keyed by its text, so a status change re-mounts the chip and it pops
  return (
    <span key={String(children)} className={`scn__tag scn__tag--${tone}`}>
      {children}
    </span>
  )
}

function Fill({ on, width = 72, children }) {
  return on ? (
    <span className="scn__val">{children}</span>
  ) : (
    <span className="scn__sk" style={{ width }} />
  )
}

function Press({ shown, pressed, label, done }) {
  if (!shown) return null
  return pressed ? (
    <span className="scn__stamp">
      <Check size={12} />
      {done}
    </span>
  ) : (
    <span className="scn__btn">{label}</span>
  )
}

function Note({ on, children }) {
  return (
    <p className={cls('scn__note scn__b', on && 'is-on')}>
      <Sparkles size={14} />
      <span>{children}</span>
    </p>
  )
}

// Counts from one number to another when `to` changes. `format` turns the
// number into the text shown. It writes the text straight to the element
// rather than through state: sixty updates a second have no business
// re-rendering the scene. With reduced motion it lands at once.
function Count({ to, format }) {
  const ref = useRef(null)
  const shown = useRef(to)

  useEffect(() => {
    const el = ref.current
    const from = shown.current
    if (!el || from === to) return undefined
    const land = () => {
      shown.current = to
      el.textContent = format(to)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      land()
      return undefined
    }
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 600)
      shown.current = Math.round(from + (to - from) * (1 - (1 - p) ** 3))
      el.textContent = format(shown.current)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, format])

  // React writes this once; after that the effect owns the text.
  return (
    <span className="scn__count" ref={ref} suppressHydrationWarning>
      {format(to)}
    </span>
  )
}

const money = (n) => `$${n.toLocaleString('en-US')}`

/* ---------- CRM: an inquiry is answered, qualified and quoted ---------- */

export function CrmScene({ beat, t }) {
  const on = (n) => beat >= n
  return (
    <div className="scn scn--split">
      <div className="scn__card">
        <p className="scn__head">
          <span className="scn__avatar">{t.initials}</span>
          <span className="scn__head-main">
            <strong>{t.customer}</strong>
            <span>{t.channel}</span>
          </span>
          <Tag tone={on(10) ? 'good' : on(4) ? 'warn' : 'plain'}>
            {on(10) ? t.stageQuoted : on(4) ? t.stageToQuote : t.stageNew}
          </Tag>
        </p>
        <div className="scn__thread">
          <p className={cls('scn__msg scn__msg--in scn__b', on(0) && 'is-on')}>{t.msg1}</p>
          {beat === 1 && (
            <p className="scn__msg scn__msg--out scn__typing">
              <span />
              <span />
              <span />
            </p>
          )}
          <p className={cls('scn__msg scn__msg--out scn__b', on(2) && 'is-on')}>
            {t.reply}
            <span className="scn__by">{t.agent}</span>
          </p>
          <p className={cls('scn__msg scn__msg--in scn__b', on(3) && 'is-on')}>{t.msg2}</p>
        </div>
      </div>

      <div className={cls('scn__card scn__card--lift', on(4) && 'is-on')}>
        <p className="scn__head">
          <span className="scn__head-main">
            <strong>{t.leadTitle}</strong>
            <span>{t.leadSub}</span>
          </span>
        </p>
        <dl className="scn__fields">
          {t.fields.map((f, i) => (
            <div key={f.name}>
              <dt>{f.name}</dt>
              <dd>
                <Fill on={on(5 + i)}>{f.value}</Fill>
              </dd>
            </div>
          ))}
        </dl>
        <div className="scn__meter">
          <span>{t.intent}</span>
          <span className="scn__meter-bar">
            <span style={{ width: on(7) ? '86%' : '0%' }} />
          </span>
          <Count to={on(7) ? 86 : 0} format={String} />
        </div>

        <div className={cls('scn__slot scn__b', on(8) && 'is-on')}>
          <p className="scn__line">
            <span className="scn__line-main">
              <strong>{t.quoteId}</strong>
              <span>
                <Fill on={on(9)} width={120}>
                  {t.quoteLine}
                </Fill>
              </span>
            </span>
            <span className="scn__amount">
              <Fill on={on(9)} width={52}>
                {t.quoteTotal}
              </Fill>
            </span>
          </p>
          <Press shown={on(9)} pressed={on(10)} label={t.approve} done={t.sent} />
        </div>
      </div>
    </div>
  )
}

/* ---------- Sourcing: a part you do not carry gets an answer ---------- */

export function SourcingScene({ beat, t }) {
  const on = (n) => beat >= n
  const status = on(9)
    ? ['good', t.statusSourced]
    : on(6)
      ? ['plain', t.statusFound]
      : on(1)
        ? ['plain', t.statusAsking]
        : ['bad', t.statusMissing]

  return (
    <div className="scn scn--split">
      <div className="scn__card">
        <p className="scn__head">
          <span className="scn__head-main">
            <strong>{t.from}</strong>
            <span>{t.fromSub}</span>
          </span>
          <Tag tone={status[0]}>{status[1]}</Tag>
        </p>
        <p className="scn__quoteblock">{t.ask}</p>
        <p className={cls('scn__line scn__line--boxed', !on(1) && 'is-flag')}>
          <img className="scn__thumb" src={t.img} alt="" width="240" height="240" />
          <span className="scn__line-main">
            <strong>{t.item}</strong>
            <span>{t.itemSub}</span>
          </span>
        </p>
        <div className={cls('scn__slot scn__b', on(7) && 'is-on')}>
          <p className="scn__line">
            <span className="scn__line-main">
              <strong>{t.replyTitle}</strong>
              <span>{t.replySub}</span>
            </span>
            <span className="scn__amount">{t.replyTotal}</span>
          </p>
          <Press shown={on(8)} pressed={on(9)} label={t.approve} done={t.sent} />
        </div>
      </div>

      <div className={cls('scn__card scn__card--lift', on(2) && 'is-on')}>
        <p className="scn__head">
          <span className="scn__head-main">
            <strong>{t.vendorsTitle}</strong>
            <span>{on(5) ? t.vendorsDone : t.vendorsBusy}</span>
          </span>
        </p>
        <ul className="scn__rows">
          {t.vendors.map((v, i) => (
            <li
              key={v.name}
              className={cls('scn__row', beat === 3 + i && 'is-scan', on(6) && v.best && 'is-pick')}
            >
              <span className="scn__line-main">
                <strong>
                  <Fill on={on(3 + i)} width={88}>
                    {v.name}
                  </Fill>
                </strong>
                <span>
                  <Fill on={on(3 + i)} width={56}>
                    {v.lead}
                  </Fill>
                </span>
              </span>
              {on(6) && v.best && <Tag tone="good">{t.best}</Tag>}
              <span className="scn__amount">
                <Fill on={on(3 + i)} width={40}>
                  {v.cost}
                </Fill>
              </span>
            </li>
          ))}
        </ul>
        <Note on={on(6)}>{t.note}</Note>
      </div>
    </div>
  )
}

/* ---------- Inventory: a shelf about to empty gets reordered ---------- */

export function InventoryScene({ beat, t }) {
  const on = (n) => beat >= n
  const ordering = on(7)
  return (
    <div className="scn scn--split">
      <div className="scn__card">
        <p className="scn__head">
          <span className="scn__head-main">
            <strong>{t.listTitle}</strong>
            <span>{on(4) ? t.listDone : t.listBusy}</span>
          </span>
        </p>
        <ul className="scn__rows">
          {t.items.map((item, i) => (
            <li
              key={item.name}
              className={cls(
                'scn__row',
                beat === i && 'is-scan',
                on(5) && i === 0 && 'is-pick',
                on(5) && i > 1 && 'is-dim',
              )}
            >
              <img className="scn__thumb" src={item.img} alt="" width="240" height="240" />
              <span className="scn__line-main">
                <strong>{item.name}</strong>
                <span>{item.sub}</span>
              </span>
              {on(i + 1) ? <Tag tone={item.tone}>{item.tag}</Tag> : <Tag>{t.checking}</Tag>}
            </li>
          ))}
        </ul>
      </div>

      <div className={cls('scn__card scn__card--lift', on(5) && 'is-on')}>
        {ordering ? (
          <div key="order" className="scn__swap">
            <p className="scn__head">
              <span className="scn__head-main">
                <strong>{t.orderTitle}</strong>
                <span>{t.orderSub}</span>
              </span>
            </p>
            <ul className="scn__rows">
              {t.order.map((line, i) => (
                <li key={line.name} className={cls('scn__row scn__b', on(7 + i) && 'is-on')}>
                  <img className="scn__thumb" src={line.img} alt="" width="240" height="240" />
                  <span className="scn__line-main">
                    <strong>{line.name}</strong>
                    <span>{line.sub}</span>
                  </span>
                  <span className="scn__amount">{money(line.amount)}</span>
                </li>
              ))}
            </ul>
            <p className="scn__total">
              <span>{t.total}</span>
              <Count
                to={on(8) ? t.order[0].amount + t.order[1].amount : t.order[0].amount}
                format={money}
              />
            </p>
            <Press shown={on(9)} pressed={on(10)} label={t.approve} done={t.sent} />
          </div>
        ) : (
          <div key="forecast" className="scn__swap">
            <p className="scn__head">
              {on(5) ? (
                <img className="scn__thumb" src={t.items[0].img} alt="" width="240" height="240" />
              ) : (
                <span className="scn__thumb scn__thumb--sk" />
              )}
              <span className="scn__head-main">
                <strong>
                  <Fill on={on(5)} width={120}>
                    {t.items[0].name}
                  </Fill>
                </strong>
                <span>{t.forecastSub}</span>
              </span>
            </p>
            <div className={cls('scn__bars', on(5) && 'is-on')}>
              {t.levels.map((level, j) => (
                <span
                  key={j}
                  className={level < 30 ? 'is-low' : undefined}
                  style={{ '--h': `${level}%`, '--j': j }}
                />
              ))}
            </div>
            <Note on={on(6)}>{t.note}</Note>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Accounts receivable: a rejected invoice gets paid ---------- */

export function ArScene({ beat, t }) {
  const on = (n) => beat >= n
  return (
    <div className="scn scn--split">
      <div className="scn__card">
        <p className="scn__head">
          <span className="scn__head-main">
            <strong>{t.listTitle}</strong>
            <span>{t.listSub}</span>
          </span>
          <span className="scn__amount scn__amount--lg">
            <Count to={on(6) ? t.riskAfter : t.riskBefore} format={money} />
          </span>
        </p>
        <ul className="scn__rows">
          {t.invoices.map((inv, i) => {
            const fixed = i === 0 && on(6)
            const chased = i === 1 && on(7)
            return (
              <li
                key={inv.id}
                className={cls('scn__row', i === 0 && beat >= 1 && beat <= 5 && 'is-scan')}
              >
                <span className="scn__line-main">
                  <strong>{inv.id}</strong>
                  <span>{fixed ? t.paysOn : chased ? t.reminded : inv.customer}</span>
                </span>
                <Tag tone={fixed ? 'good' : inv.tone}>
                  {fixed ? t.approved : chased ? t.chasing : inv.tag}
                </Tag>
                <span className="scn__amount">{inv.amount}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={cls('scn__card scn__card--lift', on(2) && 'is-on')}>
        <p className="scn__head">
          <span className="scn__head-main">
            <strong>{t.portalTitle}</strong>
            <span>{t.portalSub}</span>
          </span>
        </p>
        <ol className="scn__trail">
          <li className={on(2) ? 'is-bad' : undefined}>
            <strong>
              <Fill on={on(2)} width={64}>
                {t.reason}
              </Fill>
            </strong>
            <span>
              <Fill on={on(2)} width={110}>
                {t.reasonSub}
              </Fill>
            </span>
          </li>
          <li>
            <strong>
              <Fill on={on(3)} width={150}>
                {t.search}
              </Fill>
            </strong>
            <span>
              <Fill on={on(4)} width={130}>
                {t.found}
              </Fill>
            </span>
          </li>
          <li className={on(5) ? 'is-good' : undefined}>
            <strong>
              <Fill on={on(5)} width={84}>
                {t.resubmitted}
              </Fill>
            </strong>
            <span>
              <Fill on={on(5)} width={120}>
                {t.resubmittedSub}
              </Fill>
            </span>
          </li>
        </ol>
        <Press shown={on(6)} pressed label="" done={t.cleared} />
      </div>
    </div>
  )
}
