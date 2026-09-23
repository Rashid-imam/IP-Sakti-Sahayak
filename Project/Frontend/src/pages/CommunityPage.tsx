import { useState } from 'react';
import {
  Search,
  Building2,
  FileText,
  MapPin,
  ArrowRight,
  Mail,
  Phone,
} from 'lucide-react';

import PageFrame from '../components/PageFrame';

const communityData = [
  // =========================
  // AYURVEDA INSTITUTES
  // =========================
  {
    id: 1,
    name: 'All India Institute of Ayurveda',
    type: 'Ayurveda Institute',
    location: 'New Delhi, India',
    description: 'An apex institute for Ayurveda education, healthcare, training and innovation.',
    email: 'a••••@aiia.gov.in',
    phone: '+91 ••••• •••21',
    icon: Building2,
  },
  {
    id: 2,
    name: 'National Institute of Ayurveda',
    type: 'Ayurveda Institute',
    location: 'Jaipur, Rajasthan',
    description: 'A premier institute offering undergraduate, postgraduate and doctoral education in Ayurveda.',
    email: 'n••••@nia.nic.in',
    phone: '+91 ••••• •••42',
    icon: Building2,
  },
  {
    id: 3,
    name: 'Institute of Teaching and Research in Ayurveda',
    type: 'Ayurveda Institute',
    location: 'Jamnagar, Gujarat',
    description: 'An institute focused on Ayurveda education, clinical training and development of Ayurvedic knowledge.',
    email: 'i••••@itra.ac.in',
    phone: '+91 ••••• •••63',
    icon: Building2,
  },
  {
    id: 4,
    name: 'Banaras Hindu University – Faculty of Ayurveda',
    type: 'Ayurveda Institute',
    location: 'Varanasi, Uttar Pradesh',
    description: 'An academic centre offering education and advanced study in Ayurveda and related disciplines.',
    email: 'a••••@bhu.ac.in',
    phone: '+91 ••••• •••84',
    icon: Building2,
  },
  {
    id: 5,
    name: 'National Institute of Siddha',
    type: 'Ayurveda Institute',
    location: 'Chennai, Tamil Nadu',
    description: 'An AYUSH institution dedicated to traditional Indian medicine education and healthcare.',
    email: 'n••••@nis.ac.in',
    phone: '+91 ••••• •••35',
    icon: Building2,
  },

  // =========================
  // PATENT OWNERS
  // =========================
  {
    id: 6,
    name: 'Dabur India Limited',
    ownerName: 'Dabur India Limited',
    type: 'Patent Owner',
    location: 'New Delhi, India',
    description: 'An Ayurveda and natural-health products company with patents and other intellectual property assets.',
    email: 'i••••@dabur.com',
    phone: '+91 ••••• •••16',
    icon: FileText,
  },
  {
    id: 7,
    name: 'Patanjali Ayurved Limited',
    ownerName: 'Patanjali Ayurved Limited',
    type: 'Patent Owner',
    location: 'Haridwar, Uttarakhand',
    description: 'An Indian company working across Ayurvedic medicines, herbal products, personal care and related innovation.',
    email: 'c••••@patanjali.com',
    phone: '+91 ••••• •••27',
    icon: FileText,
  },
  {
    id: 8,
    name: 'Central Council for Research in Ayurvedic Sciences',
    ownerName: 'Central Council for Research in Ayurvedic Sciences',
    type: 'Patent Owner',
    location: 'New Delhi, India',
    description: 'An autonomous organization under the Ministry of AYUSH involved in Ayurvedic research and technology development.',
    email: 'c••••@ccras.nic.in',
    phone: '+91 ••••• •••48',
    icon: FileText,
  },
  {
    id: 9,
    name: 'Himalaya Wellness Company',
    ownerName: 'Himalaya Wellness Company',
    type: 'Patent Owner',
    location: 'Bengaluru, Karnataka',
    description: 'A healthcare and wellness organization working with herbal and Ayurvedic products and innovation.',
    email: 'i••••@himalayawellness.com',
    phone: '+91 ••••• •••59',
    icon: FileText,
  },
  {
    id: 10,
    name: 'Emami Limited',
    ownerName: 'Emami Limited',
    type: 'Patent Owner',
    location: 'Kolkata, West Bengal',
    description: 'An Indian consumer-health and wellness company with products across personal care and healthcare categories.',
    email: 'c••••@emamigroup.com',
    phone: '+91 ••••• •••70',
    icon: FileText,
  },
];

export default function Community() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredData = communityData.filter((item) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.type.toLowerCase().includes(searchText) ||
      item.location.toLowerCase().includes(searchText);

    const matchesFilter = filter === 'All' || item.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <PageFrame>
      {/* PAGE HEADER */}
      <div className="mb-6 w-full max-w-[1400px] sm:mb-8">
        <div className="mb-2 flex items-center gap-2 sm:mb-3">
          <span className="h-px w-[20px] shrink-0 bg-[#D8892F] sm:w-[24px]" />
          <span className="text-[0.95rem] font-bold uppercase tracking-[0.1em] text-[#D8892F] sm:text-[1.25rem] sm:tracking-[0.12em]">IP-SAKTI Sahayak</span>
        </div>

        <h1 className="m-0 max-w-[1000px] text-[1.75rem] font-normal leading-[1.2] tracking-[-0.02em] text-[#245C3A] sm:text-[2rem] md:text-[2.35rem]">
          Connect with the Ayurveda & IP Community.
        </h1>

        <p className="mb-0 mt-3 max-w-[850px] text-[0.85rem] leading-[1.6] text-[#607282] sm:text-[0.92rem] md:text-[1rem]">
          Search and connect with Ayurveda institutes and patent owners. Find the right people and organizations for your IP journey.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-6 flex w-full max-w-[1400px] flex-col gap-3 sm:mb-8 md:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a98a5] sm:left-4" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search institutes or patent owners..."
            className="box-border w-full rounded-[8px] border border-[#d9e3eb] bg-white py-3 pl-10 pr-3 text-[0.8rem] text-[#607282] outline-none transition-colors placeholder:text-[#8a98a5] focus:border-[#397153] sm:pl-11 sm:pr-4 sm:text-[0.85rem]"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="box-border w-full rounded-[8px] border border-[#d9e3eb] bg-white px-3 py-3 text-[0.8rem] text-[#607282] outline-none focus:border-[#397153] sm:px-4 sm:text-[0.85rem] md:w-auto md:min-w-[200px]"
        >
          <option value="All">All</option>
          <option value="Ayurveda Institute">Ayurveda Institutes</option>
          <option value="Patent Owner">Patent Owners</option>
        </select>
      </div>

      {/* COMMUNITY SECTION */}
      <section className="w-full max-w-[1400px]">
        <div className="mb-4 sm:mb-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px w-[20px] shrink-0 bg-[#D8892F] sm:w-[24px]" />
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#D8892F] sm:text-[0.78rem] sm:tracking-[0.14em]">Community Directory</span>
          </div>

          <h2 className="m-0 text-[1.4rem] font-normal leading-[1.25] text-[#245C3A] sm:text-[1.6rem] md:text-[1.8rem]">
            Ayurveda Institutes & Patent Owners
          </h2>
        </div>

        {/* CARDS */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {filteredData.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.id} className="flex min-w-0 flex-col rounded-[8px] border border-[#d9e3eb] bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[7px] bg-[#EAF4ED] text-[#245C3A] sm:h-11 sm:w-11">
                      <Icon size={20} />
                    </div>

                    <span className="max-w-[60%] rounded-full bg-[#fff8ee] px-2 py-1 text-right text-[0.58rem] font-semibold uppercase leading-[1.3] tracking-wide text-[#D8892F] sm:px-3 sm:text-[0.65rem]">
                      {item.type}
                    </span>
                  </div>

                  {/* NAME */}
                  <div className="mt-4 sm:mt-5">
                    {item.type === 'Patent Owner' && (
                      <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#D8892F]">
                        Owner Name
                      </p>
                    )}

                    <h3 className="break-words text-[1rem] font-semibold leading-[1.4] text-[#245C3A] sm:text-[1.05rem]">
                      {item.type === 'Patent Owner' ? item.ownerName : item.name}
                    </h3>
                  </div>

                  {/* LOCATION */}
                  <div className="mt-2 flex items-start gap-2 text-[0.74rem] leading-[1.4] text-[#607282] sm:mt-3 sm:text-[0.78rem]">
                    <MapPin size={14} className="mt-[1px] shrink-0" />
                    <span className="break-words">{item.location}</span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-3 flex-1 text-[0.77rem] leading-[1.55] text-[#607282] sm:text-[0.8rem]">
                    {item.description}
                  </p>

                  {/* MASKED CONTACT INFORMATION */}
                  <div className="mt-4 space-y-2 rounded-[6px] bg-[#F6F9F7] px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2 text-[0.7rem] text-[#607282]">
                      <Mail size={14} className="shrink-0 text-[#397153]" />
                      <span className="shrink-0 font-medium text-[#397153]">Email:</span>
                      <span className="min-w-0 truncate">{item.email}</span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2 text-[0.7rem] text-[#607282]">
                      <Phone size={14} className="shrink-0 text-[#397153]" />
                      <span className="shrink-0 font-medium text-[#397153]">Phone:</span>
                      <span className="truncate">{item.phone}</span>
                    </div>
                  </div>

                  {/* VIEW PROFILE */}
                  <button
                    type="button"
                    onClick={() => alert(`Opening ${item.name}`)}
                    className="mt-4 inline-flex w-fit items-center gap-2 border-0 bg-transparent p-0 text-[0.78rem] font-semibold text-[#245C3A] transition-colors hover:text-[#D8892F] sm:mt-5 sm:text-[0.8rem]"
                  >
                    View Profile
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="rounded-[8px] border border-[#d9e3eb] bg-white px-4 py-12 text-center sm:px-5 sm:py-14">
            <Search size={26} className="mx-auto mb-3 text-[#8a98a5]" />

            <h3 className="text-[0.95rem] font-semibold text-[#245C3A] sm:text-[1rem]">
              No results found
            </h3>

            <p className="mt-1 text-[0.78rem] text-[#607282] sm:text-[0.82rem]">
              Try searching for another institute or patent owner.
            </p>
          </div>
        )}
      </section>

      {/* COMMUNITY NOTE */}
      <section className="mt-8 w-full max-w-[1400px] border-t border-[#d9e3eb] pt-6 sm:mt-10 sm:pt-8">
        <div className="rounded-[8px] border border-[#eed4ad] bg-[#fff8ee] p-4 sm:p-5">
          <h3 className="text-[0.95rem] font-semibold text-[#245C3A] sm:text-[1rem]">
            Build connections through IP-SAKTI
          </h3>

          <p className="mt-1 max-w-[760px] text-[0.78rem] leading-[1.5] text-[#607282] sm:text-[0.84rem]">
            Explore institutes and patent owners working around Ayurveda, traditional knowledge and intellectual property.
          </p>
        </div>
      </section>
    </PageFrame>
  );
}