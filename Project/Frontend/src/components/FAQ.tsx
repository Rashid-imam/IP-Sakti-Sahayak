import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Can I patent it?',
    answer:
      'IP-SAKTI can help you explore whether your product or process may have patent-related possibilities by checking relevant requirements, prior-art information, and available sources. Final patentability should be assessed by a qualified IP professional.',
  },
  {
    question: 'Is it already traditional knowledge?',
    answer:
      'The system can help identify similarities with documented traditional knowledge and relevant TKDL or other official sources. A similarity result is not itself a legal determination.',
  },
  {
    question: 'Should I register a trademark?',
    answer:
      'If you are using a distinctive name, brand, logo, or mark for your product or services, trademark protection may be relevant. IP-SAKTI can guide you through the basic considerations and relevant sources.',
  },
  {
    question: 'Can I get a GI or design protection?',
    answer:
      'Depending on what you are protecting, geographical indication or design protection may be relevant. The system helps identify the possible IP route and the requirements that may need to be considered.',
  },
  {
    question: 'Do I need biodiversity/ABS permission?',
    answer:
      'If your work involves biological resources or associated traditional knowledge covered by applicable biodiversity rules, access and benefit-sharing requirements may need to be considered. IP-SAKTI helps flag situations that may require further review.',
  },
  {
    question:
      'Is my product a medicine, food, nutraceutical or cosmetic?',
    answer:
      'Product classification can affect the applicable regulatory pathway. IP-SAKTI helps organize the available product information and identify a possible classification for further regulatory review.',
  },
  {
    question: 'What regulations apply in India?',
    answer:
      'The applicable requirements depend on the product, ingredients, intended use, manufacturing process, and other factors. IP-SAKTI retrieves relevant legal and regulatory sources to help you understand the applicable framework.',
  },
  {
    question: 'What changes if I want to export it?',
    answer:
      'Exporting an Ayurveda-related product can involve additional requirements depending on the destination jurisdiction and product category. IP-SAKTI can help identify jurisdiction-specific requirements and sources.',
  },
  {
    question: 'What does the relevant law actually say?',
    answer:
      'IP-SAKTI is designed to retrieve relevant provisions from authoritative legal and regulatory sources and present them in a simpler research-oriented format with citations.',
  },
  {
    question: 'How does IP-SAKTI help with prior-art research?',
    answer:
      'The system can search relevant patent and knowledge sources for semantically similar information and highlight records that may deserve closer examination during prior-art research.',
  },
  {
    question: 'What is TKDL and why is it important?',
    answer:
      'The Traditional Knowledge Digital Library documents traditional knowledge in a structured form. IP-SAKTI can help users identify potentially relevant traditional-knowledge information during their research.',
  },
  {
    question: 'What is an IP & ABS Readiness Score?',
    answer:
      'The readiness score provides a structured snapshot of the information and checks relevant to your product, such as possible IP routes, biodiversity or ABS considerations, and regulatory factors. It is a guidance tool, not a legal certification.',
  },
  {
    question: 'Can IP-SAKTI tell me which IP protection I should use?',
    answer:
      'It can identify potentially relevant IP routes such as patents, trademarks, geographical indications, designs, copyright, or trade secrets based on the information provided. The final protection strategy should be confirmed with an appropriate professional.',
  },
  {
    question: 'Can I search for a specific ingredient?',
    answer:
      'Yes. Ingredient information can be used to explore related traditional knowledge, research, formulations, patents, and regulatory information available in the system.',
  },
  {
    question: 'What if my ingredient or product is not found?',
    answer:
      'If sufficient information cannot be found, the system should indicate the limitation rather than presenting an unsupported conclusion. You may provide additional product or ingredient information or seek human expert review.',
  },
  {
    question: 'Can I use IP-SAKTI for international research?',
    answer:
      'Yes. The research workflow can consider different jurisdictions and retrieve relevant international sources where available. Requirements can differ substantially between countries.',
  },
  {
    question: 'Are the answers from IP-SAKTI legal advice?',
    answer:
      'No. IP-SAKTI is a research and decision-support platform. Its answers and citations are intended to help users understand relevant information and identify next steps, not to replace advice from qualified legal or regulatory professionals.',
  },
  {
    question: 'What should I do when the system has low confidence?',
    answer:
      'A low-confidence result should be treated as a signal for further verification. IP-SAKTI can direct the user toward additional research or human expert review instead of presenting an uncertain answer as definitive.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="mt-14 w-full border-t border-[#d9e3eb] pt-10">
      <div className="w-full max-w-[1000px]">

        {/* Heading */}
        <div className="mb-7">

          <h2 className="m-0 text-[1.8rem] font-semibold leading-tight text-[#245C3A] sm:text-[2.1rem]">
            Frequently Asked Questions
          </h2>

          <p className="m-0 mt-2 max-w-[760px] text-[0.9rem] leading-[1.6] text-[#607282]">
            Find answers to common questions about intellectual property,
            traditional knowledge, biodiversity, regulations, and research.
          </p>
        </div>

        {/* FAQ List */}
        <div className="w-full space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden border bg-white transition-all duration-200 ${
                  isOpen
                    ? 'border-[#397153]'
                    : 'border-[#d9e3eb] hover:border-[#9AB9A5]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[0.94rem] font-semibold leading-[1.45] text-[#245C3A]">
                    {faq.question}
                  </span>

                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-all duration-200 ${
                      isOpen
                        ? 'bg-[#245C3A] text-white'
                        : 'bg-[#EAF4ED] text-[#397153]'
                    }`}
                  >
                    <ChevronDown
                      size={17}
                      strokeWidth={2.5}
                      className={`transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-[#EAF4ED] bg-[#F6F9F7] px-5 py-4">
                    <p className="m-0 max-w-[850px] text-[0.86rem] leading-[1.7] text-[#607282]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}