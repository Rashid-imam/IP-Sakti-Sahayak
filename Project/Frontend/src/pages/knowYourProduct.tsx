import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, FileText, Minus, Plus, Upload, X } from 'lucide-react';
import PageFrame from '../components/PageFrame';

type Ingredient = {
  name: string;
};

export default function KnowYourProduct() {
  const [step, setStep] = useState(1);

  const steps = ['Product', 'Ingredients', 'Result'];

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // NEW: State for Product Name and Dosage Form
  const [productName, setProductName] = useState('');
  const [dosageForm, setDosageForm] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      name: 'Ashwagandha',
    },
  ]);

  const addIngredient = () => {
    setIngredients((previous) => [
      ...previous,
      {
        name: '',
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const updateIngredient = (index: number, value: string) => {
    setIngredients((previous) =>
      previous.map((ingredient, itemIndex) =>
        itemIndex === index
          ? {
              ...ingredient,
              name: value,
            }
          : ingredient
      )
    );
  };

  const goNext = () => {
    if (step < 3) {
      setStep((previous) => previous + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  };

  return (
    <PageFrame>
      <div className="mx-auto w-full max-w-[1250px]">

        <div className="mb-10 max-w-[950px]">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#D8892F]" />

            <span className="text-[1.25rem] font-bold uppercase tracking-[0.16em] text-[#D8892F]">
              Formulation Classification
            </span>
          </div>

          <h1 className="m-0 text-[2.35rem] font-normal leading-[1.15] tracking-[-0.02em] text-[#245C3A] max-[768px]:text-[2rem] max-[480px]:text-[1.7rem]">
            Understand your product before you protect it.
          </h1>

          <p className="mt-4 max-w-[760px] text-base leading-7 text-[#607282]">
            A simple guide to understanding your product and identifying the checks worth exploring next.
          </p>
        </div>

        <div className="w-full">

          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex min-w-[500px] items-center">
              {steps.map((item, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < step;
                const isCurrent = stepNumber === step;
                const isActive = stepNumber <= step;

                return (
                  <div key={item} className="flex flex-1 items-center">

                    <div className="flex items-center gap-3">

                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${isActive ? 'border-[#397153] bg-[#397153] text-white' : 'border-[#d9e3eb] bg-white text-[#607282]'}`}>
                        {isCompleted ? <Check size={16} /> : stepNumber}
                      </div>

                      <span className={`whitespace-nowrap text-sm font-semibold ${isCurrent ? 'text-[#245C3A]' : 'text-[#607282]'}`}>
                        {item}
                      </span>
                    </div>

                    {index < steps.length - 1 && (
                      <div className={`mx-4 h-[2px] flex-1 ${stepNumber < step ? 'bg-[#397153]' : 'bg-[#d9e3eb]'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full rounded-xl border border-[#d9e3eb] bg-white p-5 shadow-[0_8px_30px_rgba(36,92,58,0.06)] sm:p-7 md:p-9">

            {step < 3 ? (
              <>

                {/* Card Heading */}

                <div className="mb-8 border-b border-[#d9e3eb] pb-6">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#D8892F]">
                    Step {step} of 2
                  </span>

                  <h2 className="mt-2 text-2xl font-semibold text-[#245C3A]">
                    {steps[step - 1]} information
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#607282]">
                    Share what you know. You can refine this later.
                  </p>
                </div>
                {step === 1 && (
                  <div className="space-y-6">

                    {/* Product Name + Dosage */}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                      {/* Product Name */}

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[#17382A]">
                          Product name
                        </span>

                        <input
                          type="text"
                          value={productName} // UPDATED
                          onChange={(e) => setProductName(e.target.value)} // UPDATED
                          placeholder="e.g. Ashwa Balance Churna"
                          className="w-full rounded-md border border-[#d9e3eb] bg-white px-4 py-3 text-sm text-[#17382A] outline-none transition placeholder:text-[#9aa8b2] focus:border-[#397153] focus:ring-2 focus:ring-[#397153]/10"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[#17382A]">
                          Dosage or form
                        </span>

                        <select
                          value={dosageForm} // UPDATED
                          onChange={(e) => setDosageForm(e.target.value)} // UPDATED
                          className="w-full rounded-md border border-[#d9e3eb] bg-white px-4 py-3 text-sm text-[#17382A] outline-none focus:border-[#397153] focus:ring-2 focus:ring-[#397153]/10"
                        >
                          <option value="" disabled>
                            Choose one
                          </option>

                          <option value="Powder">Powder</option>
                          <option value="Tablet or capsule">Tablet or capsule</option>
                          <option value="Oil">Oil</option>
                          <option value="Extract">Extract</option>
                        </select>
                      </label>
                    </div>

                    {/* Upload Formulation */}

                    <div className="rounded-lg border border-dashed border-[#d9e3eb] bg-[#F6F9F7] p-5 md:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-start gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-[#397153] shadow-sm">
                            <FileText size={21} />
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold text-[#17382A]">
                              Upload formulation
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#607282]">
                              Upload your formulation document to help with classification.
                            </p>
                          </div>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />

                        {!uploadedFile ? (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-[#397153] bg-white px-5 py-2.5 text-sm font-semibold text-[#397153] transition hover:bg-[#397153] hover:text-white"
                          >
                            <Upload size={16} />
                            Upload file
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-[#17382A] shadow-sm">

                            <FileText size={16} className="text-[#397153]" />

                            <span className="max-w-[180px] truncate">
                              {uploadedFile.name}
                            </span>

                            <button
                              type="button"
                              onClick={removeFile}
                              className="ml-1 text-[#607282] hover:text-red-600"
                              aria-label="Remove uploaded file"
                            >
                              <X size={16} />
                            </button>

                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">

                    <div className="space-y-4">
                      {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex flex-col gap-3 sm:flex-row sm:items-center">

                          <input
                            type="text"
                            placeholder="Ingredient name"
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(index, e.target.value)}
                            className="w-full rounded-md border border-[#d9e3eb] px-4 py-3 text-sm text-[#17382A] outline-none placeholder:text-[#9aa8b2] focus:border-[#397153] focus:ring-2 focus:ring-[#397153]/10"
                          />

                          {ingredients.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeIngredient(index)}
                              className="flex h-11 w-full shrink-0 items-center justify-center rounded-md border border-[#d9e3eb] text-[#607282] transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 sm:w-11"
                              aria-label="Remove ingredient"
                            >
                              <Minus size={17} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addIngredient}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#397153] transition hover:text-[#245C3A]"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#397153]">
                        <Plus size={15} />
                      </span>

                      Add another ingredient
                    </button>
                  </div>
                )}

                <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#d9e3eb] pt-6 sm:flex-row sm:items-center sm:justify-between">

                  <button
                    type="button"
                    disabled={step === 1}
                    onClick={goBack}
                    className="inline-flex items-center justify-center rounded-md border border-[#d9e3eb] bg-white px-6 py-3 text-sm font-semibold text-[#607282] transition hover:border-[#397153] hover:text-[#397153] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#397153] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245C3A]"
                  >
                    {step === 2 ? 'See possible result' : 'Continue'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </>
            ) : (

              <ClassificationResult
                productName={productName} // NEW: Passing data
                dosageForm={dosageForm}   // NEW: Passing data
                ingredients={ingredients} // NEW: Passing data
                onRestart={() => {
                  setStep(1);
                  setProductName(''); // NEW: Resetting data
                  setDosageForm('');  // NEW: Resetting data

                  setIngredients([
                    {
                      name: 'Ashwagandha',
                    },
                  ]);

                  setUploadedFile(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function ClassificationResult({
  onRestart,
  productName,
  dosageForm,
  ingredients,
}: {
  onRestart: () => void;
  productName: string;
  dosageForm: string;
  ingredients: Ingredient[];
}) {
  const navigate = useNavigate();

  const checks = [
    'Patentability',
    'Trademark',
    'ABS considerations',
    'TKDL similarity',
    'Regulatory pathway',
    'Prior art',
  ];

  // Helper function to build the smart query
  const buildSmartQuery = (topic: string) => {
    const validIngredients = ingredients.map(i => i.name).filter(n => n.trim() !== '');
    const ingredientListStr = validIngredients.length > 0 ? validIngredients.join(', ') : 'unknown herbs';
    const prodName = productName.trim() ? productName : 'an Ayurvedic product';
    const formStr = dosageForm ? dosageForm : 'formulation';

    return `I am developing ${prodName} in the form of ${formStr}. It contains: ${ingredientListStr}. Help me understand the ${topic} for this specific formulation.`;
  };

  const handleCardClick = (topic: string) => {
    const prompt = buildSmartQuery(topic);
    navigate(`/ask-sakti-ai?query=${encodeURIComponent(prompt)}`);
  };

  const handleContinueResearch = () => {
    const prompt = buildSmartQuery("general IP and regulatory steps");
    navigate(`/ask-sakti-ai?query=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="mx-auto max-w-[950px] py-5 text-center">

      {/* Result Icon */}

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4ED] text-[#397153]">
        <Check size={27} />
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="h-[2px] w-7 bg-[#D8892F]" />

        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#D8892F]">
          Your starting point
        </span>

        <span className="h-[2px] w-7 bg-[#D8892F]" />
      </div>


      <h2 className="mt-4 text-2xl font-semibold leading-tight text-[#245C3A] md:text-3xl">
        Possible category: Modified herbal formulation
      </h2>

      <p className="mx-auto mt-4 max-w-[720px] text-sm leading-7 text-[#607282]">
        Based on the information shared, this appears to be a formulation that may need both product classification and innovation-focused research.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
        {checks.map((item) => (
          <button
            key={item}
            onClick={() => handleCardClick(item)}
            className="flex w-full items-center justify-between rounded-lg border border-[#d9e3eb] bg-white px-4 py-4 transition hover:border-[#397153] hover:shadow-sm"
          >
            <div className="flex items-center gap-3">

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF4ED] text-[#397153]">
                <Check size={15} />
              </span>

              <span className="text-sm font-semibold text-[#17382A]">
                {item}
              </span>
            </div>

            <ArrowRight size={15} className="text-[#607282]" />
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center rounded-md border border-[#d9e3eb] bg-white px-6 py-3 text-sm font-semibold text-[#607282] transition hover:border-[#397153] hover:text-[#397153]"
        >
          Start again
        </button>

        <button
          type="button"
          onClick={handleContinueResearch}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#397153] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245C3A]"
        >
          Continue research
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}