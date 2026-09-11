import { Link } from 'react-router-dom';
import { FEE_DATA } from '../data/licensingFees';
import { formatNZD } from '../utils/formatNZD';

export function FeeGuideLink({ category, children = 'View detailed fees' }) {
  if (!Object.hasOwn(FEE_DATA, category)) return null;
  return <Link to={`/licensing-guide?guide=${category}`} className="mt-2 inline-block text-sm font-bold text-primary hover:underline">{children} <span aria-hidden="true">→</span></Link>;
}

function FeeRows({ rows }) {
  return (
    <dl className="divide-y divide-gray-100">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-sm">
          <dt className="text-gray-600">{row.label}{row.period && <span className="block text-xs">{row.period}</span>}</dt>
          <dd className="font-bold text-gray-900">{row.display}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function EstimatedFees({ food = false, alcohol = false, outdoor = false, alcoholRisk, specialLicence = false, review = false }) {
  const risk = alcohol && !specialLicence && Object.hasOwn(FEE_DATA.alcohol.riskLevels, alcoholRisk)
    ? FEE_DATA.alcohol.riskLevels[alcoholRisk] : null;
  const known = [];
  const variable = [];
  const categories = [];
  if (food) {
    known.push(FEE_DATA.food.levy, FEE_DATA.food.collectionFee);
    variable.push(FEE_DATA.food.registration, FEE_DATA.food.verification);
    categories.push({ id: 'food', title: 'Food business registration', note: FEE_DATA.food.note });
  }
  if (alcohol) {
    const rows = risk ? [
      { label: 'Alcohol application fee', amount: risk.application, display: formatNZD(risk.application) },
      { label: 'Alcohol annual fee', amount: risk.annual, display: formatNZD(risk.annual) },
    ] : [
      { label: 'Alcohol application fee', display: specialLicence ? 'Separate special licence schedule' : 'Depends on risk rating' },
      ...(!specialLicence ? [{ label: 'Alcohol annual fee', display: 'Depends on risk rating' }] : []),
    ];
    (risk ? known : variable).push(...rows);
    categories.push({ id: 'alcohol', title: 'Alcohol licensing', note: FEE_DATA.alcohol.note, link: 'View alcohol fee table' });
  }
  if (outdoor) {
    variable.push(
      { ...FEE_DATA.outdoor.application, label: `Outdoor dining ${FEE_DATA.outdoor.application.label.toLowerCase()}` },
      { ...FEE_DATA.outdoor.rental, label: `Outdoor dining ${FEE_DATA.outdoor.rental.label.toLowerCase()}` },
    );
    categories.push({ id: 'outdoor', title: 'Outdoor dining approval', note: 'The final charge can depend on the location and size of the approved outdoor dining area.', link: 'View outdoor dining fees' });
  }
  const amount = known.reduce((sum, row) => sum + Math.round(row.amount * 100), 0) / 100;
  const maximum = known.some((row) => row.maximum);
  const years = [...new Set(categories.map(({ id }) => FEE_DATA[id].year))];

  return (
    <section className="my-7 overflow-hidden rounded-xl border border-[#DCE6EB] bg-white">
      <div className="border-b border-gray-100 bg-[#F4F8FA] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold text-[#203746]">Estimated Fees &amp; Charges</h3>
          {years.length > 0 && <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900">{years.join(' · ')}</span>}
        </div>
        <p className="mt-2 text-sm text-gray-600">Based on the requirements identified for your business.</p>
        {review && <p className="mt-2 text-sm text-gray-600">These are reference charges for the relevant licensing categories. Council will confirm which charges apply to a transfer or change; existing charges may already have been paid.</p>}
      </div>
      <div className="p-5 sm:p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Known charges</h4>
        {known.length ? <FeeRows rows={known} /> : <p className="py-3 text-sm text-gray-600">No fixed amount can be calculated from these answers.</p>}
        {known.length > 0 && <div className="mt-2 flex flex-wrap justify-between gap-3 rounded-lg bg-blue-50 p-4 font-extrabold text-primary"><span>Known amount</span><span className="text-xl">{maximum ? 'Up to ' : ''}{formatNZD(amount)}</span></div>}
        {food && <p className="mt-3 text-sm text-gray-600">Known food charges: {FEE_DATA.food.collectionFee.maximum ? 'up to ' : ''}{formatNZD(FEE_DATA.food.levy.amount + FEE_DATA.food.collectionFee.amount)}, plus council registration and verification.</p>}
        {risk && <p className="mt-3 text-sm text-gray-600">Risk category: {risk.label}. Initial known alcohol cost: {formatNZD(risk.application + risk.annual)}.</p>}
        <h4 className="mt-6 text-xs font-bold uppercase tracking-wider text-gray-600">Variable / additional charges</h4>
        {variable.length ? <FeeRows rows={variable} /> : <p className="py-3 text-sm text-gray-600">Other charges may apply depending on your business and site.</p>}
        <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
          {categories.map((category) => <div key={category.id}>
            <h4 className="font-bold text-gray-900">{category.title}</h4>
            <p className="mt-1 text-sm leading-6 text-gray-600">{category.note}</p>
            <FeeGuideLink category={category.id}>{category.link || 'View detailed fees'}</FeeGuideLink>
          </div>)}
        </div>
        <p className="mt-5 rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-900">This is not the final amount. Additional council, verification, rental or other charges may apply.</p>
      </div>
    </section>
  );
}
