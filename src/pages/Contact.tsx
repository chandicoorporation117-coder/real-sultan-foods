import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { whatsappUrl } from '../lib/whatsapp';
import { useToast } from '../lib/toast';
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '../components/icons';

const topics = [
  'General enquiry',
  'Wholesale / bulk rates',
  'Become a distributor',
  'Problem with an order',
  'Something else',
];

export default function Contact() {
  const { notify } = useToast();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    topic: topics[0],
    message: '',
  });

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3 || form.message.trim().length < 5) {
      notify('Please add your name and a short message.', 'error');
      return;
    }
    const text = [
      `*Enquiry — ${site.name}*`,
      `Topic: ${form.topic}`,
      `Name: ${form.name}`,
      form.phone.trim() && `Phone: ${form.phone}`,
      '',
      form.message,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <section className="border-b border-forest-800/8 bg-gradient-to-b from-sand to-cream">
        <div className="container-page py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-3 text-[12.5px] font-semibold text-ink/45">
            <Link to="/" className="hover:text-forest-700">
              Home
            </Link>
            <span aria-hidden className="mx-1.5">/</span>
            <span className="text-forest-800">Contact</span>
          </nav>
          <h1 className="font-display text-[clamp(2rem,5.5vw,3.2rem)] font-black">
            Talk to us
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] text-ink/65">
            Orders, wholesale rates, distribution, or a problem with a delivery —
            WhatsApp is the fastest way to reach us, and someone actually reads it.
          </p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_400px]">
        <form onSubmit={send} className="card-surface p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold">Send a message</h2>
          <p className="mt-1.5 text-[13.5px] text-ink/55">
            This opens WhatsApp with your message ready to send.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="label">
                Your name <span className="text-red-600">*</span>
              </label>
              <input
                id="c-name"
                className="field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ahmed Raza"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="c-phone" className="label">
                Mobile number
              </label>
              <input
                id="c-phone"
                type="tel"
                className="field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0300 1234567"
                autoComplete="tel"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="c-topic" className="label">
                What&rsquo;s it about?
              </label>
              <select
                id="c-topic"
                className="field"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              >
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="c-message" className="label">
                Message <span className="text-red-600">*</span>
              </label>
              <textarea
                id="c-message"
                rows={5}
                className="field resize-y"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what you need — quantities, flavours, delivery city…"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-lg mt-6 w-full bg-[#25D366] text-forest-950 hover:brightness-105 sm:w-auto"
          >
            <WhatsAppIcon className="size-5" />
            Send on WhatsApp
          </button>
        </form>

        <aside className="flex flex-col gap-4">
          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-extrabold">Reach us directly</h2>
            <ul className="mt-4 space-y-4 text-[14.5px]">
              <li className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand text-forest-700">
                  <PhoneIcon className="size-5" />
                </span>
                <span>
                  <span className="block text-[12px] font-bold tracking-wide text-ink/45 uppercase">
                    Phone & WhatsApp
                  </span>
                  <a
                    href={`tel:+${site.whatsappNumber}`}
                    className="font-semibold hover:text-forest-700"
                  >
                    {site.phoneDisplay}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand text-forest-700">
                  <MailIcon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-bold tracking-wide text-ink/45 uppercase">
                    Email
                  </span>
                  <a
                    href={`mailto:${site.email}`}
                    className="font-semibold break-all hover:text-forest-700"
                  >
                    {site.email}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand text-forest-700">
                  <PinIcon className="size-5" />
                </span>
                <span>
                  <span className="block text-[12px] font-bold tracking-wide text-ink/45 uppercase">
                    Plant & office
                  </span>
                  <span className="font-semibold">{site.address}</span>
                </span>
              </li>
            </ul>
            <p className="mt-5 rounded-2xl bg-sand px-4 py-3 text-[13px] font-semibold text-forest-800">
              Order hours: {site.hours}
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-forest-800/8">
            <iframe
              title="Real Sultan Foods location"
              src="https://www.google.com/maps?q=Bata+Pur+Jallo+Mor+Lahore&output=embed"
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </aside>
      </div>
    </>
  );
}
