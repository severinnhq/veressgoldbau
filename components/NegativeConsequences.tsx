import { AlertCircle, CheckCircle2 } from 'lucide-react';

const issues = [
  {
    number: 1,
    title: "Rossz kivitelezés",
    consequence: "folyamatos javítás, pénzkidobás",
    negative:
      "Ha nem megbízható kivitelezőt választasz, éveken át fizetheted a hibákat – repedező falak, beázó tető, vizesedő pince.",
    positive:
      "Mi garanciát vállalunk: nincsenek rejtett hibák, nincsenek utólagos költségek.",
  },
  {
    number: 2,
    title: "Késések",
    consequence: "csúszó költözés, albérleti díjak, stressz",
    negative:
      "Egyetlen hét csúszás akár több százezer forintba is kerülhet albérletben vagy lakáshitellel párhuzamosan.",
    positive:
      "Időre szállítjuk a kulcsrakész házat – szerződésben vállalt határidőkkel.",
  },
  {
    number: 3,
    title: "Megszökik az alvállalkozó",
    consequence: "félbehagyott ház",
    negative:
      "Hány család maradt már félkész házban, amikor eltűnt a kivitelező vagy csődbe ment a brigád?",
    positive:
      "Több mint 50 sikeresen átadott projekt, 100% megbízhatóság – mi végigvisszük.",
  },
  {
    number: 4,
    title: "Nincs terv, nincs koncepció",
    consequence: "értéktelen ház, amit senki nem akar majd megvenni",
    negative:
      "A rosszul megtervezett ház nemcsak élhetetlen, de később eladhatatlan is.",
    positive:
      "Mi építészeti koncepciót is adunk: értéktartó, jövőálló otthon.",
  },
  {
    number: 5,
    title: "Hiányos engedélyek",
    consequence: "bírság, visszabontás",
    negative:
      "Sokan nem tudják, hogy akár milliós bírság is lehet egy hiányzó engedély miatt.",
    positive:
      "Mi minden hatósági ügyintézést elvégzünk helyetted – jogilag is biztos lábakon áll a házad.",
  },
];

export default function NegativeConsequences() {
  return (
    <section className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-12 text-center text-red-600">
        ⚠️ Figyelem! Ezek a kockázatok várnak, ha nem megfelelő kivitelezőt választ:
      </h2>
      <div className="grid gap-10 max-w-5xl mx-auto">
        {issues.map(({ number, title, consequence, negative, positive }) => (
          <div
            key={number}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-red-300 shadow-lg"
          >
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-2xl font-extrabold text-red-600">
                🔴 {number}.
              </span>
              <h3 className="text-2xl font-semibold text-gray-800">
                {title} ➜ <span className="italic text-red-600">{consequence}</span>
              </h3>
            </div>
            <p className="flex items-start gap-2 text-gray-700 mb-3">
              <AlertCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <span className="font-medium text-red-600">❌</span> {negative}
            </p>
            <p className="flex items-start gap-2 text-green-700">
              <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <span className="font-medium text-green-700">✅</span> {positive}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
