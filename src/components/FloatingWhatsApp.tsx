import { useLocation } from 'react-router-dom';
import { enquiryUrl } from '../lib/whatsapp';
import { WhatsAppIcon } from './icons';

/** Always-there escape hatch: some customers would rather just message. */
export default function FloatingWhatsApp() {
  const { pathname } = useLocation();
  // The product page has its own sticky buy bar on mobile — don't stack them.
  const nudgedUp = pathname.startsWith('/product/');

  return (
    <a
      href={enquiryUrl()}
      target="_blank"
      rel="noreferrer"
      className={`fixed right-4 z-[60] grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_36px_-10px_rgba(37,211,102,0.8)] transition-transform hover:scale-110 active:scale-95 sm:right-6 ${
        nudgedUp
          ? 'bottom-[calc(5.75rem+env(safe-area-inset-bottom))] lg:bottom-6'
          : 'bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-6'
      }`}
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon className="size-7" />
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.4s]" />
    </a>
  );
}
