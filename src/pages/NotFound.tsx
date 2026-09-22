import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page py-24">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
        <span className="font-display text-7xl font-black text-gold-500">404</span>
        <h1 className="font-display text-3xl font-black">This shelf is empty</h1>
        <p className="text-[15px] text-ink/60">
          The page you&rsquo;re after doesn&rsquo;t exist — but there are 26 drinks that do.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn btn-lg btn-gold">
            Browse the shop
          </Link>
          <Link to="/" className="btn btn-lg btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
