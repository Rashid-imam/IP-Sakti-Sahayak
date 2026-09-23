import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Info,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';

import PageFrame from '../components/PageFrame';

type Ingredient = {
  name: string;
  proportion: string;
};

type PatentResult = {
  id: number;
  title: string;
  publicationNumber: string;
  applicant: string;
  filingDate: string;
  classification: string;
  similarity: number;
  matchedTerms: string[];
  abstract: string;
};

export default function PatentSearchPage() {
  const [scientificName, setScientificName] = useState('');

  const [indication, setIndication] = useState('');

  const [ipcCode, setIpcCode] = useState('');

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      name: '',
      proportion: '',
    },
  ]);

  const [isSearching, setIsSearching] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

  const [results, setResults] = useState<PatentResult[]>([]);

  const [selectedPatent, setSelectedPatent] =
    useState<PatentResult | null>(null);

  /* ================= INGREDIENT HANDLERS ================= */

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        name: '',
        proportion: '',
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) return;

    setIngredients(
      ingredients.filter(
        (_, ingredientIndex) => ingredientIndex !== index,
      ),
    );
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    const updatedIngredients = [...ingredients];

    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };

    setIngredients(updatedIngredients);
  };

  /* ================= SEARCH ================= */

  const handleSearch = () => {
    if (!scientificName.trim() && !indication.trim()) {
      alert(
        'Please enter at least a scientific/botanical name or target indication.',
      );
      return;
    }

    setIsSearching(true);
    setHasSearched(false);

    /*
      DEMO SEARCH

      Later replace this section with your FastAPI API call.

      Example:

      const response = await axios.post(
        'YOUR_BACKEND_URL/api/patents/search',
        {
          scientific_name: scientificName,
          ingredients,
          target_indication: indication,
          ipc_code: ipcCode,
        }
      );

      setResults(response.data.results);
    */

    window.setTimeout(() => {
      const demoResults: PatentResult[] = [
        {
          id: 1,
          title:
            'Herbal formulation containing Withania somnifera for therapeutic applications',
          publicationNumber: 'IN202011021111A',
          applicant: 'Indian Patent Applicant',
          filingDate: '19 May 2020',
          classification: 'A61K 36/00',
          similarity: 86,
          matchedTerms: [
            'Withania somnifera',
            'Herbal formulation',
            'A61K',
          ],
          abstract:
            'A herbal composition containing plant-derived ingredients for therapeutic applications. The record includes Withania somnifera as one of the disclosed botanical ingredients.',
        },
        {
          id: 2,
          title:
            'Poly-herbal formulation containing Curcuma longa and Withania somnifera',
          publicationNumber: 'IN3440MUM2014A',
          applicant: 'Vaidya Vidyadhar Govind',
          filingDate: '30 October 2014',
          classification: 'A61K 36/00',
          similarity: 78,
          matchedTerms: [
            'Curcuma longa',
            'Withania somnifera',
            'Poly-herbal',
          ],
          abstract:
            'A poly-herbal formulation containing several medicinal plants including Curcuma longa and Withania somnifera in predetermined quantities.',
        },
        {
          id: 3,
          title:
            'Plant extract composition and method of preparation thereof',
          publicationNumber: 'US8481087B2',
          applicant: 'Indian Institute of Science',
          filingDate: '06 June 2011',
          classification: 'A61K 36/00',
          similarity: 69,
          matchedTerms: [
            'Withania somnifera',
            'Plant extract',
            'A61K 36/00',
          ],
          abstract:
            'A composition based on Withania somnifera plant extract together with methods for preparation and use of the extract.',
        },
      ];

      setResults(demoResults);
      setHasSearched(true);
      setIsSearching(false);
    }, 1200);
  };

  const clearSearch = () => {
    setScientificName('');
    setIndication('');
    setIpcCode('');

    setIngredients([
      {
        name: '',
        proportion: '',
      },
    ]);

    setResults([]);
    setHasSearched(false);
    setSelectedPatent(null);
  };

  return (
    <PageFrame>

      <div className="mb-8 max-w-[900px]">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[#D8892F]" />

          <span className="text-[1.25rem] font-bold uppercase tracking-[0.16em] text-[#D8892F]">
            Patent Intelligence
          </span>
        </div>

        <h1 className="m-0 text-[2.35rem] font-normal leading-[1.15] tracking-[-0.02em] text-[#245C3A] max-[768px]:text-[2rem] max-[480px]:text-[1.7rem]">
          Patent Search
        </h1>

        <p className="mt-4 max-w-[780px] text-[0.95rem] leading-7 text-[#607282]">
          Search for existing patent publications and other
          prior-art records that may be relevant to your Ayurvedic
          product or formulation.
        </p>
      </div>

      {/* ================= INFORMATION BANNER ================= */}

      <div className="mb-7 flex gap-3 rounded-[8px] border border-[#D9E3DB] bg-[#EAF4ED] p-4">
        <Info
          size={20}
          className="mt-0.5 shrink-0 text-[#397153]"
        />

        <div>
          <h3 className="m-0 text-[0.88rem] font-semibold text-[#245C3A]">
            What is Prior-Art Search?
          </h3>

          <p className="mt-1.5 mb-0 text-[0.8rem] leading-6 text-[#607282]">
            Prior-art search helps identify earlier patent
            publications, formulations and technical disclosures
            that may be relevant to your product. A matching record
            does not by itself determine whether your invention is
            patentable.
          </p>
        </div>
      </div>

      {/* ================= SEARCH FORM ================= */}

      <section className="rounded-[8px] border border-[#D9E3DB] bg-white shadow-[0_4px_18px_rgba(36,92,58,0.05)]">

        {/* Form Header */}

        <div className="border-b border-[#E4EBE6] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF4ED] text-[#397153]">
              <FileSearch size={20} />
            </div>

            <div>
              <h2 className="m-0 text-[1.15rem] font-semibold text-[#245C3A]">
                Define your search
              </h2>

              <p className="mt-1 text-[0.78rem] text-[#607282]">
                Add the technical details of your product.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 max-[600px]:p-4">

          {/* ================= BOTANICAL NAME ================= */}

          <div className="mb-6">
            <label
              htmlFor="scientificName"
              className="mb-2 block text-[0.82rem] font-semibold text-[#245C3A]"
            >
              1. Scientific / Botanical Name
            </label>

            <input
              id="scientificName"
              type="text"
              value={scientificName}
              onChange={(event) =>
                setScientificName(event.target.value)
              }
              placeholder="e.g. Withania somnifera"
              className="w-full rounded-[6px] border border-[#D9E3DB] bg-white px-3.5 py-3 text-[0.85rem] text-[#17382A] outline-none transition-all placeholder:text-[#9AA8A0] focus:border-[#397153] focus:ring-2 focus:ring-[#397153]/10"
            />

            <p className="mt-1.5 text-[0.72rem] text-[#7B8981]">
              Enter the botanical or scientific name of the main
              ingredient.
            </p>
          </div>

          {/* ================= INGREDIENTS ================= */}

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-[0.82rem] font-semibold text-[#245C3A]">
                2. Active Ingredients &amp; Proportion
              </label>

              <button
                type="button"
                onClick={addIngredient}
                className="text-[0.76rem] font-semibold text-[#397153] transition-colors hover:text-[#245C3A]"
              >
                + Add ingredient
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_180px_auto] gap-3 max-[650px]:grid-cols-1"
                >
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(event) =>
                      updateIngredient(
                        index,
                        'name',
                        event.target.value,
                      )
                    }
                    placeholder="Ingredient name"
                    className="rounded-[6px] border border-[#D9E3DB] px-3.5 py-3 text-[0.84rem] text-[#17382A] outline-none transition-all placeholder:text-[#9AA8A0] focus:border-[#397153] focus:ring-2 focus:ring-[#397153]/10"
                  />

                  <input
                    type="text"
                    value={ingredient.proportion}
                    onChange={(event) =>
                      updateIngredient(
                        index,
                        'proportion',
                        event.target.value,
                      )
                    }
                    placeholder="Proportion / ratio"
                    className="rounded-[6px] border border-[#D9E3DB] px-3.5 py-3 text-[0.84rem] text-[#17382A] outline-none transition-all placeholder:text-[#9AA8A0] focus:border-[#397153] focus:ring-2 focus:ring-[#397153]/10"
                  />

                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                    aria-label="Remove ingredient"
                    className="grid h-[43px] w-[43px] place-items-center rounded-[6px] border border-[#E3E9E5] text-[#8A9890] transition-colors hover:border-[#D8892F] hover:text-[#D8892F] disabled:cursor-not-allowed disabled:opacity-30 max-[650px]:w-full"
                  >
                    <X size={17} />
                  </button>
                </div>
              ))}
            </div>

            <p className="mt-1.5 text-[0.72rem] text-[#7B8981]">
              Add the ingredients that make your formulation
              distinctive and, where known, their proportions.
            </p>
          </div>

          {/* ================= TARGET INDICATION ================= */}

          <div className="mb-6">
            <label
              htmlFor="indication"
              className="mb-2 block text-[0.82rem] font-semibold text-[#245C3A]"
            >
              3. Target Indication
            </label>

            <input
              id="indication"
              type="text"
              value={indication}
              onChange={(event) =>
                setIndication(event.target.value)
              }
              placeholder="e.g. hair growth, alopecia treatment, digestive health"
              className="w-full rounded-[6px] border border-[#D9E3DB] bg-white px-3.5 py-3 text-[0.85rem] text-[#17382A] outline-none transition-all placeholder:text-[#9AA8A0] focus:border-[#397153] focus:ring-2 focus:ring-[#397153]/10"
            />

            <p className="mt-1.5 text-[0.72rem] text-[#7B8981]">
              Describe what the product is intended to address.
            </p>
          </div>

          {/* ================= IPC ================= */}

          <div className="mb-7">
            <label
              htmlFor="ipcCode"
              className="mb-2 block text-[0.82rem] font-semibold text-[#245C3A]"
            >
              4. IPC / CPC Code
            </label>

            <div className="flex gap-3 max-[550px]:flex-col">
              <input
                id="ipcCode"
                type="text"
                value={ipcCode}
                onChange={(event) =>
                  setIpcCode(event.target.value)
                }
                placeholder="e.g. A61K 36/00"
                className="flex-1 rounded-[6px] border border-[#D9E3DB] px-3.5 py-3 text-[0.85rem] text-[#17382A] outline-none transition-all placeholder:text-[#9AA8A0] focus:border-[#397153] focus:ring-2 focus:ring-[#397153]/10"
              />

              <button
                type="button"
                onClick={() => setIpcCode('A61K 36/00')}
                className="rounded-[6px] border border-[#397153] bg-[#EAF4ED] px-4 py-3 text-[0.78rem] font-semibold text-[#397153] transition-colors hover:bg-[#397153] hover:text-white"
              >
                Suggest herbal class
              </button>
            </div>

            <p className="mt-1.5 text-[0.72rem] text-[#7B8981]">
              IPC/CPC classification can help narrow the technical
              search area.
            </p>
          </div>

          {/* ================= ACTIONS ================= */}

          <div className="flex items-center justify-between gap-4 max-[600px]:flex-col-reverse max-[600px]:items-stretch">

            <button
              type="button"
              onClick={clearSearch}
              className="rounded-[6px] border border-[#D9E3DB] bg-white px-5 py-3 text-[0.82rem] font-semibold text-[#607282] transition-colors hover:border-[#397153] hover:text-[#397153]"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#245C3A] px-6 py-3 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#397153] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSearching ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Searching prior art...
                </>
              ) : (
                <>
                  <Search size={17} />
                  Search Prior Art
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </div>
        </div>
      </section>

      {/* ================= SEARCH RESULTS ================= */}

      {hasSearched && (
        <section className="mt-8">

          {/* Result Header */}

          <div className="mb-5 flex items-end justify-between gap-4 max-[650px]:flex-col max-[650px]:items-start">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-[#397153]"
                />

                <span className="text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[#397153]">
                  Search completed
                </span>
              </div>

              <h2 className="m-0 text-[1.6rem] font-semibold text-[#245C3A]">
                Potential prior-art matches
              </h2>

              <p className="mt-1.5 text-[0.8rem] text-[#607282]">
                {results.length} records identified from the current
                search.
              </p>
            </div>

            <div className="rounded-full bg-[#EAF4ED] px-3.5 py-2 text-[0.75rem] font-semibold text-[#397153]">
              Query:
              <span className="ml-1 text-[#245C3A]">
                {scientificName || indication}
              </span>
            </div>

          </div>

          {/* Results */}

          <div className="space-y-4">

            {results.map((patent) => (
              <article
                key={patent.id}
                className="rounded-[8px] border border-[#D9E3DB] bg-white p-5 transition-all hover:border-[#8DB39B] hover:shadow-[0_5px_18px_rgba(36,92,58,0.07)]"
              >
                <div className="flex gap-5 max-[800px]:flex-col">

                  {/* Similarity */}

                  <div className="flex w-[82px] shrink-0 flex-col items-center justify-start max-[800px]:w-auto max-[800px]:flex-row max-[800px]:gap-3">

                    <div className="grid h-[68px] w-[68px] place-items-center rounded-full border-[5px] border-[#EAF4ED] bg-white">
                      <span className="text-[1.05rem] font-bold text-[#397153]">
                        {patent.similarity}%
                      </span>
                    </div>

                    <span className="mt-2 text-center text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-[#7B8981] max-[800px]:mt-0">
                      Similarity
                    </span>

                  </div>

                  {/* Patent Information */}

                  <div className="min-w-0 flex-1">

                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-[4px] bg-[#EAF4ED] px-2 py-1 text-[0.66rem] font-bold text-[#397153]">
                        {patent.classification}
                      </span>

                      <span className="text-[0.7rem] text-[#8A9890]">
                        {patent.publicationNumber}
                      </span>
                    </div>

                    <h3 className="m-0 text-[1.05rem] font-semibold leading-6 text-[#245C3A]">
                      {patent.title}
                    </h3>

                    <p className="mt-2 text-[0.78rem] leading-6 text-[#607282]">
                      {patent.abstract}
                    </p>

                    {/* Matched terms */}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {patent.matchedTerms.map((term) => (
                        <span
                          key={term}
                          className="rounded-full bg-[#F0F7F2] px-2.5 py-1 text-[0.68rem] font-medium text-[#397153]"
                        >
                          {term}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}

                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#EEF2EF] pt-3 max-[600px]:flex-col max-[600px]:items-start">

                      <div className="text-[0.7rem] text-[#7B8981]">
                        Applicant:{' '}
                        <span className="font-medium text-[#607282]">
                          {patent.applicant}
                        </span>

                        <span className="mx-2">•</span>

                        Filed:{' '}
                        <span className="font-medium text-[#607282]">
                          {patent.filingDate}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPatent(patent)
                        }
                        className="inline-flex items-center gap-1.5 text-[0.76rem] font-semibold text-[#397153] transition-colors hover:text-[#245C3A]"
                      >
                        View patent details
                        <ArrowRight size={14} />
                      </button>

                    </div>
                  </div>
                </div>
              </article>
            ))}

          </div>

          {/* ================= WARNING ================= */}

          <div className="mt-6 flex gap-3 rounded-[8px] border border-[#E5C98B] bg-[#FFF9ED] p-4">
            <ShieldAlert
              size={20}
              className="mt-0.5 shrink-0 text-[#D8892F]"
            />

            <div>
              <h3 className="m-0 text-[0.82rem] font-semibold text-[#8B6127]">
                Research guidance
              </h3>

              <p className="mt-1.5 mb-0 text-[0.75rem] leading-6 text-[#607282]">
                Similarity indicates potentially relevant records. It
                is not a legal determination of novelty,
                patentability, infringement or freedom to operate.
                Review the original patent documents and consult a
                qualified IP professional where required.
              </p>
            </div>
          </div>

        </section>
      )}

      {/* ================= PATENT DETAIL MODAL ================= */}

      {selectedPatent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17382A]/45 p-4">

          <div className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-[10px] bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4 border-b border-[#E4EBE6] px-6 py-5">

              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#D8892F]">
                  Patent record
                </span>

                <h2 className="mt-1.5 mb-0 text-[1.25rem] font-semibold leading-6 text-[#245C3A]">
                  {selectedPatent.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatent(null)}
                aria-label="Close patent details"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EAF4ED] text-[#397153] transition-colors hover:bg-[#DDEDE3]"
              >
                <X size={18} />
              </button>

            </div>

            {/* Modal Body */}

            <div className="space-y-5 px-6 py-6">

              <div className="grid grid-cols-2 gap-4 max-[550px]:grid-cols-1">

                <div className="rounded-[6px] bg-[#F0F7F2] p-4">
                  <span className="text-[0.68rem] uppercase tracking-[0.08em] text-[#7B8981]">
                    Publication number
                  </span>

                  <p className="mt-1 mb-0 text-[0.84rem] font-semibold text-[#245C3A]">
                    {selectedPatent.publicationNumber}
                  </p>
                </div>

                <div className="rounded-[6px] bg-[#F0F7F2] p-4">
                  <span className="text-[0.68rem] uppercase tracking-[0.08em] text-[#7B8981]">
                    Classification
                  </span>

                  <p className="mt-1 mb-0 text-[0.84rem] font-semibold text-[#245C3A]">
                    {selectedPatent.classification}
                  </p>
                </div>

                <div className="rounded-[6px] bg-[#F0F7F2] p-4">
                  <span className="text-[0.68rem] uppercase tracking-[0.08em] text-[#7B8981]">
                    Applicant
                  </span>

                  <p className="mt-1 mb-0 text-[0.84rem] font-semibold text-[#245C3A]">
                    {selectedPatent.applicant}
                  </p>
                </div>

                <div className="rounded-[6px] bg-[#F0F7F2] p-4">
                  <span className="text-[0.68rem] uppercase tracking-[0.08em] text-[#7B8981]">
                    Filing date
                  </span>

                  <p className="mt-1 mb-0 text-[0.84rem] font-semibold text-[#245C3A]">
                    {selectedPatent.filingDate}
                  </p>
                </div>

              </div>

              <div>
                <h3 className="m-0 text-[0.82rem] font-semibold text-[#397153]">
                  Why this record was matched
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPatent.matchedTerms.map((term) => (
                    <span
                      key={term}
                      className="rounded-full bg-[#EAF4ED] px-3 py-1.5 text-[0.72rem] font-semibold text-[#397153]"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="m-0 text-[0.82rem] font-semibold text-[#397153]">
                  Abstract
                </h3>

                <p className="mt-2 mb-0 text-[0.82rem] leading-7 text-[#607282]">
                  {selectedPatent.abstract}
                </p>
              </div>

              <div className="rounded-[6px] border border-[#E5C98B] bg-[#FFF9ED] p-4">
                <p className="m-0 text-[0.74rem] leading-6 text-[#806A4D]">
                  This result is provided for research and information
                  purposes. Similarity does not establish patent
                  infringement, lack of novelty or legal
                  unpatentability.
                </p>
              </div>

            </div>

            {/* Modal Footer */}

            <div className="flex justify-end border-t border-[#E4EBE6] px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedPatent(null)}
                className="rounded-[6px] bg-[#245C3A] px-5 py-2.5 text-[0.78rem] font-semibold text-white transition-colors hover:bg-[#397153]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </PageFrame>
  );
}