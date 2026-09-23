import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Info,
  Network,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';

import PageFrame from '../components/PageFrame';

type Ingredient = {
  id: number;
  name: string;
};

type Match = {
  title: string;
  similarity: number;
  category: string;
  description: string;
  reference: string;
};

export default function TKDLPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: '' },
  ]);
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);

  const addIngredient = () => {
    setIngredients((current) => [...current, { id: Date.now(), name: '' }]);
  };

  const updateIngredient = (id: number, value: string) => {
    setIngredients((current) =>
      current.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, name: value } : ingredient,
      ),
    );
  };

  const removeIngredient = (id: number) => {
    if (ingredients.length === 1) return;

    setIngredients((current) =>
      current.filter((ingredient) => ingredient.id !== id),
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Please upload a file smaller than 10 MB.');
      event.target.value = '';
      return;
    }

    setUploadedFile(file);
    event.target.value = '';
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleScan = () => {
    const hasIngredient = ingredients.some(
      (ingredient) => ingredient.name.trim().length > 0,
    );

    if (!hasIngredient && !description.trim()) {
      alert(
        'Please enter at least one ingredient or describe the traditional use.',
      );
      return;
    }

    setIsScanning(true);
    setHasResults(false);

    /*
      DEMO ONLY

      Replace this section with your FastAPI API call later.

      Example:

      const response = await fetch(`${API_URL}/api/tkdl/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          description,
        }),
      });

      const data = await response.json();
    */

    setTimeout(() => {
      setMatches([
        {
          title: 'Traditional use related to Ashwagandha',
          similarity: 87,
          category: 'Medicinal use',
          description:
            'The submitted ingredient/use description shows strong semantic similarity with a documented traditional knowledge record.',
          reference: 'TKDL reference record',
        },
        {
          title: 'Classical herbal preparation',
          similarity: 64,
          category: 'Formulation',
          description:
            'A moderate similarity was detected with a documented traditional formulation.',
          reference: 'Traditional knowledge reference',
        },
        {
          title: 'Traditional therapeutic application',
          similarity: 42,
          category: 'Therapeutic use',
          description:
            'The system found a lower-confidence semantic relationship with a traditional-use record.',
          reference: 'Knowledge record',
        },
      ]);

      setIsScanning(false);
      setHasResults(true);
    }, 1000);
  };

  return (
    <PageFrame>
      {/* HEADER */}
      <div className="mb-8 max-w-[950px]">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[#D8892F]" />
          <span className="text-[1.25rem] font-bold uppercase tracking-[0.16em] text-[#D8892F]">
            Knowledge Protection
          </span>
        </div>

        <h1 className="m-0 text-[2.35rem] font-normal leading-[1.15] tracking-[-0.02em] text-[#245C3A] max-[768px]:text-[2rem] max-[480px]:text-[1.7rem]">
          TKDL Similarity Scanner
        </h1>

        <p className="mt-4 max-w-[780px] text-[0.96rem] leading-7 text-[#607282]">
          Check whether your ingredient, formulation or traditional use shows
          semantic similarity with documented traditional knowledge records.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-[minmax(0,1.65fr)_320px] items-start gap-6 max-[1000px]:grid-cols-1">
        {/* LEFT */}
        <div className="min-w-0">
          {/* SCANNER CARD */}
          <section className="rounded-[10px] border border-[#d9e3eb] bg-white p-6 shadow-[0_5px_20px_rgba(36,92,58,0.04)] max-[480px]:p-4">
            {/* CARD HEADER */}
            <div className="mb-6 flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-[#EAF4ED] text-[#397153]">
                <Network size={22} />
              </div>

              <div>
                <h2 className="m-0 text-[1.05rem] font-semibold text-[#245C3A]">
                  What would you like to scan?
                </h2>

                <p className="mt-1 text-[0.78rem] leading-5 text-[#607282]">
                  Enter the ingredients and traditional use associated with
                  your product.
                </p>
              </div>
            </div>

            {/* INGREDIENTS */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[0.8rem] font-semibold text-[#245C3A]">
                  Ingredients
                </label>

                <button
                  type="button"
                  onClick={addIngredient}
                  className="text-[0.72rem] font-semibold text-[#397153] transition-colors hover:text-[#245C3A]"
                >
                  + Add ingredient
                </button>
              </div>

              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={ingredient.id} className="flex items-center gap-2">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#F0F7F2] text-[0.7rem] font-semibold text-[#397153]">
                      {index + 1}
                    </div>

                    <input
                      value={ingredient.name}
                      onChange={(event) =>
                        updateIngredient(ingredient.id, event.target.value)
                      }
                      placeholder="Enter ingredient name"
                      className="min-w-0 flex-1 rounded-md border border-[#d9e3eb] bg-white px-3 py-2.5 text-[0.82rem] text-[#17382A] outline-none transition placeholder:text-[#8a98a5] focus:border-[#397153] focus:ring-2 focus:ring-[#397153]/10"
                    />

                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[#d9e3eb] bg-white text-[#607282] transition-colors hover:text-[#b04444]"
                        aria-label="Remove ingredient"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* TRADITIONAL USE */}
            <div className="mt-5">
              <label className="mb-2 block text-[0.8rem] font-semibold text-[#245C3A]">
                Traditional use / formulation description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                placeholder="Describe the traditional use, preparation, therapeutic purpose or formulation..."
                className="w-full resize-none rounded-md border border-[#d9e3eb] bg-white px-3 py-3 text-[0.82rem] leading-6 text-[#17382A] outline-none transition placeholder:text-[#8a98a5] focus:border-[#397153] focus:ring-2 focus:ring-[#397153]/10"
              />
            </div>

            {/* DOCUMENT */}
            <div className="mt-5">
              <div className="mb-2">
                <p className="m-0 text-[0.8rem] font-semibold text-[#245C3A]">
                  Supporting document
                </p>

                <p className="mt-1 text-[0.72rem] text-[#607282]">
                  Optional formulation notes or research documents.
                </p>
              </div>

              <input
                id="tkdl-document"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />

              {!uploadedFile ? (
                <label
                  htmlFor="tkdl-document"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-[#397153] bg-[#EAF4ED] px-3 py-2 text-[0.78rem] font-semibold text-[#245C3A] transition-colors hover:bg-[#DDEDE3]"
                >
                  <Upload size={16} />
                  Upload document
                </label>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-md border border-[#c9dfd0] bg-[#F1F8F3] px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText size={17} className="shrink-0 text-[#397153]" />

                    <span className="truncate text-[0.78rem] font-semibold text-[#245C3A]">
                      {uploadedFile.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="shrink-0 text-[#607282] hover:text-[#b04444]"
                    aria-label="Remove uploaded document"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* SCAN BUTTON */}
            <div className="mt-6 border-t border-[#d9e3eb] pt-5">
              <button
                type="button"
                onClick={handleScan}
                disabled={isScanning}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#245C3A] px-5 py-3 text-[0.84rem] font-semibold text-white shadow-[0_5px_16px_rgba(36,92,58,0.16)] transition hover:bg-[#397153] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isScanning ? (
                  <>
                    <Search size={17} className="animate-pulse" />
                    Scanning traditional knowledge...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Scan for TK Similarity
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </section>

          {/* RESULTS */}
          {hasResults && (
            <section className="mt-6 overflow-hidden rounded-[10px] border border-[#d9e3eb] bg-white">
              {/* RESULT HEADER */}
              <div className="border-b border-[#d9e3eb] bg-[#F6F9F7] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF4ED] text-[#397153]">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>
                      <p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#D8892F]">
                        Scan complete
                      </p>

                      <h2 className="mt-1 text-[1.1rem] font-semibold text-[#245C3A]">
                        Potential knowledge matches
                      </h2>
                    </div>
                  </div>

                  <div className="shrink-0 rounded-full bg-[#EAF4ED] px-3 py-1.5 text-[0.7rem] font-semibold text-[#397153]">
                    {matches.length} records found
                  </div>
                </div>
              </div>

              {/* MATCHES */}
              <div className="space-y-3 p-5">
                {matches.map((match) => {
                  const isHigh = match.similarity >= 75;
                  const isMedium =
                    match.similarity >= 50 && match.similarity < 75;

                  return (
                    <div
                      key={match.title}
                      className="rounded-[8px] border border-[#d9e3eb] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#EAF4ED] text-[#397153]">
                            <Network size={17} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="m-0 text-[0.84rem] font-semibold text-[#245C3A]">
                              {match.title}
                            </h3>

                            <span className="mt-1 inline-block text-[0.68rem] text-[#607282]">
                              {match.category}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${
                            isHigh
                              ? 'bg-[#EAF4ED] text-[#397153]'
                              : isMedium
                                ? 'bg-[#FFF4DF] text-[#A06A18]'
                                : 'bg-[#F3F5F6] text-[#607282]'
                          }`}
                        >
                          {match.similarity}% match
                        </span>
                      </div>

                      <p className="mt-3 text-[0.76rem] leading-5 text-[#607282]">
                        {match.description}
                      </p>

                      <div className="mt-3 flex items-center gap-2 border-t border-[#d9e3eb] pt-3 text-[0.68rem] text-[#397153]">
                        <FileText size={14} />
                        {match.reference}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RESULT WARNING */}
              <div className="mx-5 mb-5 rounded-md border border-[#E5C98B] bg-[#FFF9ED] p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={19} className="mt-0.5 shrink-0 text-[#D8892F]" />

                  <div>
                    <p className="m-0 text-[0.8rem] font-semibold text-[#245C3A]">
                      Similarity is not a legal determination
                    </p>

                    <p className="mt-1 text-[0.72rem] leading-5 text-[#607282]">
                      A similarity result indicates that a knowledge record
                      may be relevant. It does not by itself establish prior
                      art, ownership, infringement or legal status.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="flex min-w-0 flex-col gap-5">
          {/* HOW IT WORKS */}
          <div className="rounded-[10px] border border-[#d9e3eb] bg-white p-5">
            <h2 className="m-0 text-[0.92rem] font-semibold text-[#245C3A]">
              How the scanner works
            </h2>

            <div className="mt-5 space-y-5">
              {[
                [
                  '01',
                  'Describe',
                  'Add ingredients, formulation details or traditional use.',
                ],
                [
                  '02',
                  'Compare',
                  'The system searches for semantically related knowledge records.',
                ],
                [
                  '03',
                  'Measure',
                  'Potential matches are grouped by similarity level.',
                ],
                [
                  '04',
                  'Review',
                  'Relevant records can be reviewed before taking further action.',
                ],
              ].map(([number, title, text]) => (
                <div key={number} className="flex items-start gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EAF4ED] text-[0.68rem] font-bold text-[#397153]">
                    {number}
                  </span>

                  <div>
                    <p className="m-0 text-[0.78rem] font-semibold text-[#245C3A]">
                      {title}
                    </p>

                    <p className="mt-1 text-[0.7rem] leading-5 text-[#607282]">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT IS TKDL */}
          <div className="rounded-[10px] border border-[#d9e3eb] bg-[#F6F9F7] p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[#245C3A] text-[#E5C98B]">
                <Network size={18} />
              </div>

              <div>
                <h2 className="m-0 text-[0.85rem] font-semibold text-[#245C3A]">
                  Traditional Knowledge
                </h2>

                <p className="mt-2 text-[0.72rem] leading-5 text-[#607282]">
                  The scanner helps identify potentially relevant documented
                  traditional knowledge so that it can be considered during IP
                  research.
                </p>
              </div>
            </div>
          </div>

          {/* RESPONSIBLE RESEARCH */}
          <div className="rounded-[10px] border border-[#eed4ad] bg-[#fff8ee] p-5">
            <ShieldCheck size={19} className="text-[#D8892F]" />

            <strong className="mt-2 block text-[0.85rem] text-[#245C3A]">
              Use results carefully
            </strong>

            <p className="mt-1 text-[0.74rem] leading-5 text-[#607282]">
              Similarity scores are research indicators. Review the underlying
              records and applicable legal requirements before making an IP
              decision.
            </p>
          </div>

          {/* INFO */}
          <div className="flex gap-2 px-1 text-[0.68rem] leading-5 text-[#8a98a5]">
            <Info size={14} className="mt-0.5 shrink-0" />
            <span>
              The scanner is intended to support research and knowledge
              discovery.
            </span>
          </div>
        </aside>
      </div>
    </PageFrame>
  );
}